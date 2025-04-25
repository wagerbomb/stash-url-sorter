(function() {
    'use strict';
    
    if (!window.csLib) {
      window.csLib = {
        callGQL: (reqData) => 
          fetch(`/graphql`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reqData),
          })
          .then((res) => res.json())
          .then((res) => res.data),
          
        waitForElement: function(selector, callback) {
          var el = document.querySelector(selector);
          if (el) return callback(el);
          setTimeout(this.waitForElement.bind(this), 100, selector, callback);
        },
        
        PathElementListener: function(path, element, callback) {
          if (window.location.pathname.startsWith(path))
            this.waitForElement(element, callback);
          
          const oldPushState = history.pushState;
          history.pushState = function(state, title, url) {
            oldPushState.call(this, state, title, url);
            if (url && url.startsWith(path))
              window.csLib.waitForElement(element, callback);
          };
        },
        
        getConfiguration: async function(pluginId, fallback = {}) {
          return fallback;
        },
        
        setConfiguration: async function(pluginId, values) {
          return values;
        }
      };
    }
    
    const DOMAINS = [
      "adultfilmdatabase.com", "allmylinks.com", "alterotic.com", "apclips.com", 
      "babepedia.com", "beacons.ai", "bsky.app", "boobpedia.com", "brazzers.com", 
      "campsite.bio", "camsoda.com", "chaturbate.com", "clips4sale.com", 
      "coomer.su", "darkfans.com", "data18.com", "dbnaked.com", "eastcoasttalents.com", 
      "egafd.com", "eurobabeindex.com", "europornstar.com", "f2f.com", "facebook.com", 
      "fancentro.com", "fanfever.com", "fansdb.cc", "fansly.com", "fikfap.com", 
      "freeones.com", "iafd.com", "imdb.com", "indexxx.com", "instagram.com", 
      "iwantclips.com", "justfor.fans", "karups.com", "linktr.ee", "loverfans.com", 
      "loyalfans.com", "manyvids.com", "my.bio", "mydirtyhobby.com", "myfreecams.com", 
      "mym.fans", "onlyfans.com", "patreon.com", "pornhub.com", "pornhub.org", 
      "pornteengirl.com", "privacy.com.br", "reddit.com", "redgifs.com", "sextpanther.com", 
      "sheer.com", "slushy.com", "snapchat.com", "stashdb.org", "stripchat.com", 
      "suicidegirls.com", "t.me", "telegram.com", "theporndb.net", "thenude.com", 
      "tiktok.com", "ton.place", "tumblr.com", "twitch.tv", "twitter.com", "uviu.com", 
      "vk.com", "wordpress.com", "x.com", "xhamster.com", "xvideos.com", "youtube.com"
    ];
    
    const PLUGIN_ID = 'stashURLSorter';
    
    const DEFAULT_CONFIG = {
      version: 1,
      enabled: true,
      domains: DOMAINS
    };
    
    function extractDomain(url) {
      try {
        const match = url.match(/^(?:https?:\/\/)?(?:www\.)?([^\/]+)/i);
        return match ? match[1].toLowerCase() : url.toLowerCase();
      } catch (e) {
        return url.toLowerCase();
      }
    }
    
    function hasCustomIcon(url, domains) {
      const domain = extractDomain(url);
      
      for (const knownDomain of domains) {
        if (domain === knownDomain || 
            domain.endsWith('.' + knownDomain) || 
            domain.includes(knownDomain)) {
          return true;
        }
      }
      
      return false;
    }
    
    async function sortPerformerURLs(performerId, config) {
      try {
        const query = `
          query FindPerformer($id: ID!) {
            findPerformer(id: $id) {
              id
              urls
              name
            }
          }
        `;
        
        const variables = { id: performerId };
        const result = await csLib.callGQL({ query, variables });
        
        if (!result || !result.findPerformer) {
          return false;
        }
        
        const performer = result.findPerformer;
        const urls = performer.urls || [];
        
        if (urls.length <= 1) {
          alert('Not enough URLs to sort');
          return false;
        }
        
        const sortedUrls = [...urls].sort((a, b) => {
          const aHasIcon = hasCustomIcon(a, config.domains);
          const bHasIcon = hasCustomIcon(b, config.domains);
          
          if (aHasIcon && !bHasIcon) return -1;
          if (!aHasIcon && bHasIcon) return 1;
          
          return extractDomain(a).localeCompare(extractDomain(b));
        });
        
        const updateQuery = `
          mutation PerformerUpdate($input: PerformerUpdateInput!) {
            performerUpdate(input: $input) {
              id
            }
          }
        `;
        
        const updateVariables = {
          input: {
            id: performerId,
            urls: sortedUrls
          }
        };
        
        await csLib.callGQL({ query: updateQuery, variables: updateVariables });
        window.location.reload();
        
        return true;
      } catch (error) {
        alert('Error sorting URLs: ' + error.message);
        return false;
      }
    }
    
    function addSortButtonToEditPage(config) {
      if (!config.enabled) return;
      
      const currentPath = window.location.pathname;
      const performerIdMatch = currentPath.match(/\/performers\/(\d+)/);
      
      if (!performerIdMatch) return;
      
      const performerId = performerIdMatch[1];
      
      const observer = new MutationObserver((mutations, obs) => {
        const urlsLabels = Array.from(document.querySelectorAll('label, th, td, div')).filter(
          el => el.textContent.trim() === 'URLs'
        );
        
        if (urlsLabels.length > 0) {
          for (const label of urlsLabels) {
            const container = label.closest('tr, .row, div');
            if (container && !document.getElementById('sort-urls-btn')) {
              const button = document.createElement('button');
              button.id = 'sort-urls-btn';
              button.className = 'btn btn-secondary ml-2';
              button.textContent = 'Sort URLs';
              button.style.marginLeft = '10px';
              
              label.style.display = 'flex';
              label.style.alignItems = 'center';
              
              label.appendChild(button);
              
              button.addEventListener('click', async () => {
                await sortPerformerURLs(performerId, config);
              });
              
              obs.disconnect();
              return;
            }
          }
        }
      });
      
      observer.observe(document.body, { childList: true, subtree: true });
      
      setTimeout(() => {
        const urlsLabels = Array.from(document.querySelectorAll('label, th, td, div')).filter(
          el => el.textContent.trim() === 'URLs'
        );
        
        for (const label of urlsLabels) {
          if (!document.getElementById('sort-urls-btn')) {
            const button = document.createElement('button');
            button.id = 'sort-urls-btn';
            button.className = 'btn btn-secondary ml-2';
            button.textContent = 'Sort URLs';
            button.style.marginLeft = '10px';
            
            label.style.display = 'flex';
            label.style.alignItems = 'center';
            
            label.appendChild(button);
            
            button.addEventListener('click', async () => {
              await sortPerformerURLs(performerId, config);
            });
            
            observer.disconnect();
            return;
          }
        }
      }, 500);
    }
    
    async function initPlugin() {
      try {
        const config = await csLib.getConfiguration(PLUGIN_ID, DEFAULT_CONFIG);
        
        if (!config.domains || !Array.isArray(config.domains)) {
          config.domains = DOMAINS;
        }
        
        await csLib.setConfiguration(PLUGIN_ID, config);
        
        addSortButtonToEditPage(config);
        
        window.addEventListener('popstate', () => {
          setTimeout(() => {
            addSortButtonToEditPage(config);
          }, 500);
        });
        
        const oldPushState = history.pushState;
        history.pushState = function(state, title, url) {
          oldPushState.call(this, state, title, url);
          setTimeout(() => {
            addSortButtonToEditPage(config);
          }, 500);
        };
        
      } catch (error) {
        // Error handling silently fails
      }
    }
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initPlugin);
    } else {
      setTimeout(initPlugin, 0);
    }
    
  })();