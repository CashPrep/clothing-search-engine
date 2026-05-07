import type { RetailerConfig } from './types';
import { parseRssFeed } from '../feed-parsers/rss';
import { parseGoogleShoppingFeed } from '../feed-parsers/google-shopping';
import { parseCsvFeed } from '../feed-parsers/csv';

// ============================================================
// RETAILER REGISTRY — 50+ retailers
// Add/modify retailer configs here. Each entry needs:
//   slug, name, baseUrl, feedUrl, feedType, parser function
// ============================================================

export const RETAILERS: RetailerConfig[] = [
  // ── FASHION & APPAREL ──────────────────────────────────────
  {
    slug: 'asos',
    name: 'ASOS',
    baseUrl: 'https://www.asos.com',
    feedUrl: 'https://datafeed.asos.com/feeds/products.xml', // affiliate feed via AWIN
    feedType: 'XML',
    affiliateNetwork: 'awin',
    category: 'fashion',
    parser: (raw) => parseRssFeed(raw, { idField: 'g:id', imageField: 'g:image_link', priceField: 'g:price', urlField: 'link' }),
  },
  {
    slug: 'zara',
    name: 'Zara',
    baseUrl: 'https://www.zara.com',
    feedUrl: 'https://www.zara.com/itxrest/3/catalog/store/11719/category/woman/product?ajax=true&part=0&cnt=100',
    feedType: 'JSON',
    affiliateNetwork: 'none',
    category: 'fashion',
    parser: (raw) => parseZaraJson(raw),
  },
  {
    slug: 'hm',
    name: 'H&M',
    baseUrl: 'https://www2.hm.com',
    feedUrl: 'https://www2.hm.com/en_us/search-results.html?q=clothing&sort=stock&image-size=small&image=model&offset=0&page-size=50',
    feedType: 'JSON',
    affiliateNetwork: 'cj',
    category: 'fashion',
    parser: (raw) => parseHmJson(raw),
  },
  {
    slug: 'nordstrom',
    name: 'Nordstrom',
    baseUrl: 'https://www.nordstrom.com',
    feedUrl: 'https://datafeed.nordstrom.com/feed.xml',
    feedType: 'XML',
    affiliateNetwork: 'rakuten',
    category: 'department',
    parser: (raw) => parseRssFeed(raw, { idField: 'g:id', imageField: 'g:image_link', priceField: 'g:price', urlField: 'link' }),
  },
  {
    slug: 'macys',
    name: "Macy's",
    baseUrl: 'https://www.macys.com',
    feedUrl: 'https://productfeed.macys.com/feed.xml',
    feedType: 'XML',
    affiliateNetwork: 'cj',
    category: 'department',
    parser: (raw) => parseRssFeed(raw, { idField: 'g:id', imageField: 'g:image_link', priceField: 'g:price', urlField: 'link' }),
  },
  {
    slug: 'gap',
    name: 'Gap',
    baseUrl: 'https://www.gap.com',
    feedUrl: 'https://www.gap.com/catalog/feed/feed.xml',
    feedType: 'XML',
    affiliateNetwork: 'impact',
    category: 'fashion',
    parser: (raw) => parseRssFeed(raw, { idField: 'g:id', imageField: 'g:image_link', priceField: 'g:price', urlField: 'link' }),
  },
  {
    slug: 'old-navy',
    name: 'Old Navy',
    baseUrl: 'https://www.oldnavy.com',
    feedUrl: 'https://www.oldnavy.com/catalog/feed/feed.xml',
    feedType: 'XML',
    affiliateNetwork: 'impact',
    category: 'fashion',
    parser: (raw) => parseRssFeed(raw, { idField: 'g:id', imageField: 'g:image_link', priceField: 'g:price', urlField: 'link' }),
  },
  {
    slug: 'banana-republic',
    name: 'Banana Republic',
    baseUrl: 'https://bananarepublic.gap.com',
    feedUrl: 'https://bananarepublic.gap.com/catalog/feed/feed.xml',
    feedType: 'XML',
    affiliateNetwork: 'impact',
    category: 'fashion',
    parser: (raw) => parseRssFeed(raw, { idField: 'g:id', imageField: 'g:image_link', priceField: 'g:price', urlField: 'link' }),
  },
  {
    slug: 'anthropologie',
    name: 'Anthropologie',
    baseUrl: 'https://www.anthropologie.com',
    feedUrl: 'https://datafeed.anthropologie.com/feed.xml',
    feedType: 'XML',
    affiliateNetwork: 'rakuten',
    category: 'fashion',
    parser: (raw) => parseRssFeed(raw, { idField: 'g:id', imageField: 'g:image_link', priceField: 'g:price', urlField: 'link' }),
  },
  {
    slug: 'free-people',
    name: 'Free People',
    baseUrl: 'https://www.freepeople.com',
    feedUrl: 'https://datafeed.freepeople.com/feed.xml',
    feedType: 'XML',
    affiliateNetwork: 'rakuten',
    category: 'fashion',
    parser: (raw) => parseRssFeed(raw, { idField: 'g:id', imageField: 'g:image_link', priceField: 'g:price', urlField: 'link' }),
  },
  {
    slug: 'urban-outfitters',
    name: 'Urban Outfitters',
    baseUrl: 'https://www.urbanoutfitters.com',
    feedUrl: 'https://datafeed.urbanoutfitters.com/feed.xml',
    feedType: 'XML',
    affiliateNetwork: 'rakuten',
    category: 'fashion',
    parser: (raw) => parseRssFeed(raw, { idField: 'g:id', imageField: 'g:image_link', priceField: 'g:price', urlField: 'link' }),
  },
  {
    slug: 'forever21',
    name: 'Forever 21',
    baseUrl: 'https://www.forever21.com',
    feedUrl: 'https://productfeed.forever21.com/feed.xml',
    feedType: 'XML',
    affiliateNetwork: 'impact',
    category: 'fashion',
    parser: (raw) => parseRssFeed(raw, { idField: 'g:id', imageField: 'g:image_link', priceField: 'g:price', urlField: 'link' }),
  },
  {
    slug: 'express',
    name: 'Express',
    baseUrl: 'https://www.express.com',
    feedUrl: 'https://productfeed.express.com/feed.xml',
    feedType: 'XML',
    affiliateNetwork: 'cj',
    category: 'fashion',
    parser: (raw) => parseRssFeed(raw, { idField: 'g:id', imageField: 'g:image_link', priceField: 'g:price', urlField: 'link' }),
  },
  {
    slug: 'j-crew',
    name: 'J.Crew',
    baseUrl: 'https://www.jcrew.com',
    feedUrl: 'https://www.jcrew.com/catalog/feed.xml',
    feedType: 'XML',
    affiliateNetwork: 'rakuten',
    category: 'fashion',
    parser: (raw) => parseRssFeed(raw, { idField: 'g:id', imageField: 'g:image_link', priceField: 'g:price', urlField: 'link' }),
  },
  {
    slug: 'uniqlo',
    name: 'Uniqlo',
    baseUrl: 'https://www.uniqlo.com',
    feedUrl: 'https://www.uniqlo.com/us/en/api/commerce/v3/en/us/catalog/search?path=%2Fmen%2Fall-products&ab_test_info=&clientId=aos-57xcc2ip&limit=50&offset=0',
    feedType: 'JSON',
    affiliateNetwork: 'rakuten',
    category: 'fashion',
    parser: (raw) => parseUniqloJson(raw),
  },
  {
    slug: 'target-fashion',
    name: 'Target',
    baseUrl: 'https://www.target.com',
    feedUrl: 'https://redsky.target.com/redsky_aggregations/v1/web/plp_search_v2?key=9f36aeafbe60771e321a7cc95a78140772ab3e96&channel=WEB&count=50&default_purchasability_filter=true&include_sponsored=true&keyword=clothing',
    feedType: 'JSON',
    affiliateNetwork: 'impact',
    category: 'department',
    parser: (raw) => parseTargetJson(raw),
  },
  {
    slug: 'walmart-fashion',
    name: 'Walmart',
    baseUrl: 'https://www.walmart.com',
    feedUrl: 'https://www.walmart.com/search?q=clothing&facet=brand%3A&sort=best_match&page=1&affinityOverride=default',
    feedType: 'JSON',
    affiliateNetwork: 'impact',
    category: 'department',
    parser: (raw) => parseWalmartJson(raw),
  },
  {
    slug: 'shein',
    name: 'SHEIN',
    baseUrl: 'https://www.shein.com',
    feedUrl: 'https://us.shein.com/product-list-v2-p-1.html?facets=attr_ids%3D&sort=9&limit=20&from=user-ads-detail-fb',
    feedType: 'JSON',
    affiliateNetwork: 'none',
    category: 'fashion',
    parser: (raw) => parseSheinJson(raw),
  },
  {
    slug: 'boohoo',
    name: 'boohoo',
    baseUrl: 'https://www.boohoo.com',
    feedUrl: 'https://productfeed.boohoo.com/us/feed.xml',
    feedType: 'XML',
    affiliateNetwork: 'awin',
    category: 'fashion',
    parser: (raw) => parseRssFeed(raw, { idField: 'g:id', imageField: 'g:image_link', priceField: 'g:price', urlField: 'link' }),
  },
  {
    slug: 'prettylittlething',
    name: 'PrettyLittleThing',
    baseUrl: 'https://www.prettylittlething.com',
    feedUrl: 'https://productfeed.prettylittlething.com/us/feed.xml',
    feedType: 'XML',
    affiliateNetwork: 'awin',
    category: 'fashion',
    parser: (raw) => parseRssFeed(raw, { idField: 'g:id', imageField: 'g:image_link', priceField: 'g:price', urlField: 'link' }),
  },
  {
    slug: 'nastygal',
    name: 'Nasty Gal',
    baseUrl: 'https://www.nastygal.com',
    feedUrl: 'https://productfeed.nastygal.com/us/feed.xml',
    feedType: 'XML',
    affiliateNetwork: 'awin',
    category: 'fashion',
    parser: (raw) => parseRssFeed(raw, { idField: 'g:id', imageField: 'g:image_link', priceField: 'g:price', urlField: 'link' }),
  },
  {
    slug: 'revolve',
    name: 'Revolve',
    baseUrl: 'https://www.revolve.com',
    feedUrl: 'https://www.revolve.com/r/Feed.jsp?navsrc=main',
    feedType: 'XML',
    affiliateNetwork: 'rakuten',
    category: 'fashion',
    parser: (raw) => parseRssFeed(raw, { idField: 'g:id', imageField: 'g:image_link', priceField: 'g:price', urlField: 'link' }),
  },
  {
    slug: 'farfetch',
    name: 'Farfetch',
    baseUrl: 'https://www.farfetch.com',
    feedUrl: 'https://productfeed.farfetch.com/feed.xml',
    feedType: 'XML',
    affiliateNetwork: 'cj',
    category: 'luxury-fashion',
    parser: (raw) => parseRssFeed(raw, { idField: 'g:id', imageField: 'g:image_link', priceField: 'g:price', urlField: 'link' }),
  },
  {
    slug: 'net-a-porter',
    name: 'Net-A-Porter',
    baseUrl: 'https://www.net-a-porter.com',
    feedUrl: 'https://productfeed.net-a-porter.com/feed.xml',
    feedType: 'XML',
    affiliateNetwork: 'cj',
    category: 'luxury-fashion',
    parser: (raw) => parseRssFeed(raw, { idField: 'g:id', imageField: 'g:image_link', priceField: 'g:price', urlField: 'link' }),
  },
  {
    slug: 'ssense',
    name: 'SSENSE',
    baseUrl: 'https://www.ssense.com',
    feedUrl: 'https://productfeed.ssense.com/feed.xml',
    feedType: 'XML',
    affiliateNetwork: 'cj',
    category: 'luxury-fashion',
    parser: (raw) => parseRssFeed(raw, { idField: 'g:id', imageField: 'g:image_link', priceField: 'g:price', urlField: 'link' }),
  },
  // ── SHOES ─────────────────────────────────────────────────
  {
    slug: 'zappos',
    name: 'Zappos',
    baseUrl: 'https://www.zappos.com',
    feedUrl: 'https://productfeed.zappos.com/feed.xml',
    feedType: 'XML',
    affiliateNetwork: 'cj',
    category: 'shoes',
    parser: (raw) => parseRssFeed(raw, { idField: 'g:id', imageField: 'g:image_link', priceField: 'g:price', urlField: 'link' }),
  },
  {
    slug: 'dsw',
    name: 'DSW',
    baseUrl: 'https://www.dsw.com',
    feedUrl: 'https://productfeed.dsw.com/feed.xml',
    feedType: 'XML',
    affiliateNetwork: 'impact',
    category: 'shoes',
    parser: (raw) => parseRssFeed(raw, { idField: 'g:id', imageField: 'g:image_link', priceField: 'g:price', urlField: 'link' }),
  },
  {
    slug: 'nike',
    name: 'Nike',
    baseUrl: 'https://www.nike.com',
    feedUrl: 'https://productfeed.nike.com/feed.xml',
    feedType: 'XML',
    affiliateNetwork: 'rakuten',
    category: 'shoes',
    parser: (raw) => parseRssFeed(raw, { idField: 'g:id', imageField: 'g:image_link', priceField: 'g:price', urlField: 'link' }),
  },
  {
    slug: 'adidas',
    name: 'Adidas',
    baseUrl: 'https://www.adidas.com',
    feedUrl: 'https://productfeed.adidas.com/feed.xml',
    feedType: 'XML',
    affiliateNetwork: 'cj',
    category: 'shoes',
    parser: (raw) => parseRssFeed(raw, { idField: 'g:id', imageField: 'g:image_link', priceField: 'g:price', urlField: 'link' }),
  },
  {
    slug: 'steve-madden',
    name: 'Steve Madden',
    baseUrl: 'https://www.stevemadden.com',
    feedUrl: 'https://productfeed.stevemadden.com/feed.xml',
    feedType: 'XML',
    affiliateNetwork: 'cj',
    category: 'shoes',
    parser: (raw) => parseRssFeed(raw, { idField: 'g:id', imageField: 'g:image_link', priceField: 'g:price', urlField: 'link' }),
  },
  // ── OUTDOOR / ATHLETIC ────────────────────────────────────
  {
    slug: 'rei',
    name: 'REI',
    baseUrl: 'https://www.rei.com',
    feedUrl: 'https://productfeed.rei.com/feed.xml',
    feedType: 'XML',
    affiliateNetwork: 'impact',
    category: 'outdoor',
    parser: (raw) => parseRssFeed(raw, { idField: 'g:id', imageField: 'g:image_link', priceField: 'g:price', urlField: 'link' }),
  },
  {
    slug: 'patagonia',
    name: 'Patagonia',
    baseUrl: 'https://www.patagonia.com',
    feedUrl: 'https://productfeed.patagonia.com/feed.xml',
    feedType: 'XML',
    affiliateNetwork: 'none',
    category: 'outdoor',
    parser: (raw) => parseRssFeed(raw, { idField: 'g:id', imageField: 'g:image_link', priceField: 'g:price', urlField: 'link' }),
  },
  {
    slug: 'north-face',
    name: 'The North Face',
    baseUrl: 'https://www.thenorthface.com',
    feedUrl: 'https://productfeed.thenorthface.com/feed.xml',
    feedType: 'XML',
    affiliateNetwork: 'cj',
    category: 'outdoor',
    parser: (raw) => parseRssFeed(raw, { idField: 'g:id', imageField: 'g:image_link', priceField: 'g:price', urlField: 'link' }),
  },
  {
    slug: 'lululemon',
    name: 'Lululemon',
    baseUrl: 'https://www.lululemon.com',
    feedUrl: 'https://productfeed.lululemon.com/feed.xml',
    feedType: 'XML',
    affiliateNetwork: 'rakuten',
    category: 'athletic',
    parser: (raw) => parseRssFeed(raw, { idField: 'g:id', imageField: 'g:image_link', priceField: 'g:price', urlField: 'link' }),
  },
  {
    slug: 'under-armour',
    name: 'Under Armour',
    baseUrl: 'https://www.underarmour.com',
    feedUrl: 'https://productfeed.underarmour.com/feed.xml',
    feedType: 'XML',
    affiliateNetwork: 'impact',
    category: 'athletic',
    parser: (raw) => parseRssFeed(raw, { idField: 'g:id', imageField: 'g:image_link', priceField: 'g:price', urlField: 'link' }),
  },
  // ── GENERAL RETAIL ────────────────────────────────────────
  {
    slug: 'amazon-fashion',
    name: 'Amazon',
    baseUrl: 'https://www.amazon.com',
    feedUrl: 'https://webservices.amazon.com/paapi5/searchitems', // PA-API 5.0
    feedType: 'API',
    affiliateNetwork: 'amazon-associates',
    category: 'general',
    parser: (raw) => parseAmazonApi(raw),
  },
  {
    slug: 'ebay-fashion',
    name: 'eBay',
    baseUrl: 'https://www.ebay.com',
    feedUrl: 'https://svcs.ebay.com/services/search/FindingService/v1',
    feedType: 'JSON',
    affiliateNetwork: 'ebay-partner-network',
    category: 'marketplace',
    parser: (raw) => parseEbayJson(raw),
  },
  {
    slug: 'kohls',
    name: "Kohl's",
    baseUrl: 'https://www.kohls.com',
    feedUrl: 'https://productfeed.kohls.com/feed.xml',
    feedType: 'XML',
    affiliateNetwork: 'cj',
    category: 'department',
    parser: (raw) => parseRssFeed(raw, { idField: 'g:id', imageField: 'g:image_link', priceField: 'g:price', urlField: 'link' }),
  },
  {
    slug: 'jcpenney',
    name: 'JCPenney',
    baseUrl: 'https://www.jcpenney.com',
    feedUrl: 'https://productfeed.jcpenney.com/feed.xml',
    feedType: 'XML',
    affiliateNetwork: 'cj',
    category: 'department',
    parser: (raw) => parseRssFeed(raw, { idField: 'g:id', imageField: 'g:image_link', priceField: 'g:price', urlField: 'link' }),
  },
  {
    slug: 'bloomingdales',
    name: "Bloomingdale's",
    baseUrl: 'https://www.bloomingdales.com',
    feedUrl: 'https://productfeed.bloomingdales.com/feed.xml',
    feedType: 'XML',
    affiliateNetwork: 'rakuten',
    category: 'department',
    parser: (raw) => parseRssFeed(raw, { idField: 'g:id', imageField: 'g:image_link', priceField: 'g:price', urlField: 'link' }),
  },
  {
    slug: 'saks',
    name: 'Saks Fifth Avenue',
    baseUrl: 'https://www.saksfifthavenue.com',
    feedUrl: 'https://productfeed.saksfifthavenue.com/feed.xml',
    feedType: 'XML',
    affiliateNetwork: 'rakuten',
    category: 'luxury-department',
    parser: (raw) => parseRssFeed(raw, { idField: 'g:id', imageField: 'g:image_link', priceField: 'g:price', urlField: 'link' }),
  },
  {
    slug: 'abercrombie',
    name: 'Abercrombie & Fitch',
    baseUrl: 'https://www.abercrombie.com',
    feedUrl: 'https://productfeed.abercrombie.com/feed.xml',
    feedType: 'XML',
    affiliateNetwork: 'cj',
    category: 'fashion',
    parser: (raw) => parseRssFeed(raw, { idField: 'g:id', imageField: 'g:image_link', priceField: 'g:price', urlField: 'link' }),
  },
  {
    slug: 'hollister',
    name: 'Hollister',
    baseUrl: 'https://www.hollisterco.com',
    feedUrl: 'https://productfeed.hollisterco.com/feed.xml',
    feedType: 'XML',
    affiliateNetwork: 'cj',
    category: 'fashion',
    parser: (raw) => parseRssFeed(raw, { idField: 'g:id', imageField: 'g:image_link', priceField: 'g:price', urlField: 'link' }),
  },
  {
    slug: 'american-eagle',
    name: 'American Eagle',
    baseUrl: 'https://www.ae.com',
    feedUrl: 'https://productfeed.ae.com/feed.xml',
    feedType: 'XML',
    affiliateNetwork: 'impact',
    category: 'fashion',
    parser: (raw) => parseRssFeed(raw, { idField: 'g:id', imageField: 'g:image_link', priceField: 'g:price', urlField: 'link' }),
  },
  {
    slug: 'torrid',
    name: 'Torrid',
    baseUrl: 'https://www.torrid.com',
    feedUrl: 'https://productfeed.torrid.com/feed.xml',
    feedType: 'XML',
    affiliateNetwork: 'cj',
    category: 'plus-size',
    parser: (raw) => parseRssFeed(raw, { idField: 'g:id', imageField: 'g:image_link', priceField: 'g:price', urlField: 'link' }),
  },
  {
    slug: 'lane-bryant',
    name: 'Lane Bryant',
    baseUrl: 'https://www.lanebryant.com',
    feedUrl: 'https://productfeed.lanebryant.com/feed.xml',
    feedType: 'XML',
    affiliateNetwork: 'cj',
    category: 'plus-size',
    parser: (raw) => parseRssFeed(raw, { idField: 'g:id', imageField: 'g:image_link', priceField: 'g:price', urlField: 'link' }),
  },
  {
    slug: 'loft',
    name: 'LOFT',
    baseUrl: 'https://www.loft.com',
    feedUrl: 'https://productfeed.loft.com/feed.xml',
    feedType: 'XML',
    affiliateNetwork: 'rakuten',
    category: 'fashion',
    parser: (raw) => parseRssFeed(raw, { idField: 'g:id', imageField: 'g:image_link', priceField: 'g:price', urlField: 'link' }),
  },
  {
    slug: 'reformation',
    name: 'Reformation',
    baseUrl: 'https://www.thereformation.com',
    feedUrl: 'https://productfeed.thereformation.com/feed.xml',
    feedType: 'XML',
    affiliateNetwork: 'rakuten',
    category: 'sustainable-fashion',
    parser: (raw) => parseRssFeed(raw, { idField: 'g:id', imageField: 'g:image_link', priceField: 'g:price', urlField: 'link' }),
  },
  {
    slug: 'everlane',
    name: 'Everlane',
    baseUrl: 'https://www.everlane.com',
    feedUrl: 'https://productfeed.everlane.com/feed.xml',
    feedType: 'XML',
    affiliateNetwork: 'rakuten',
    category: 'sustainable-fashion',
    parser: (raw) => parseRssFeed(raw, { idField: 'g:id', imageField: 'g:image_link', priceField: 'g:price', urlField: 'link' }),
  },
  {
    slug: 'mango',
    name: 'Mango',
    baseUrl: 'https://shop.mango.com',
    feedUrl: 'https://productfeed.mango.com/us/feed.xml',
    feedType: 'XML',
    affiliateNetwork: 'awin',
    category: 'fashion',
    parser: (raw) => parseRssFeed(raw, { idField: 'g:id', imageField: 'g:image_link', priceField: 'g:price', urlField: 'link' }),
  },
  {
    slug: 'cos',
    name: 'COS',
    baseUrl: 'https://www.cos.com',
    feedUrl: 'https://productfeed.cos.com/us/feed.xml',
    feedType: 'XML',
    affiliateNetwork: 'awin',
    category: 'fashion',
    parser: (raw) => parseRssFeed(raw, { idField: 'g:id', imageField: 'g:image_link', priceField: 'g:price', urlField: 'link' }),
  },
  {
    slug: 'primark',
    name: 'Primark',
    baseUrl: 'https://www.primark.com',
    feedUrl: 'https://productfeed.primark.com/us/feed.xml',
    feedType: 'XML',
    affiliateNetwork: 'none',
    category: 'fashion',
    parser: (raw) => parseRssFeed(raw, { idField: 'g:id', imageField: 'g:image_link', priceField: 'g:price', urlField: 'link' }),
  },
  {
    slug: 'topshop',
    name: 'Topshop',
    baseUrl: 'https://www.topshop.com',
    feedUrl: 'https://productfeed.topshop.com/us/feed.xml',
    feedType: 'XML',
    affiliateNetwork: 'awin',
    category: 'fashion',
    parser: (raw) => parseRssFeed(raw, { idField: 'g:id', imageField: 'g:image_link', priceField: 'g:price', urlField: 'link' }),
  },
  {
    slug: 'missguided',
    name: 'Missguided',
    baseUrl: 'https://www.missguided.com',
    feedUrl: 'https://productfeed.missguided.com/us/feed.xml',
    feedType: 'XML',
    affiliateNetwork: 'awin',
    category: 'fashion',
    parser: (raw) => parseRssFeed(raw, { idField: 'g:id', imageField: 'g:image_link', priceField: 'g:price', urlField: 'link' }),
  },
  {
    slug: 'princess-polly',
    name: 'Princess Polly',
    baseUrl: 'https://www.princesspolly.com',
    feedUrl: 'https://productfeed.princesspolly.com/feed.xml',
    feedType: 'XML',
    affiliateNetwork: 'impact',
    category: 'fashion',
    parser: (raw) => parseRssFeed(raw, { idField: 'g:id', imageField: 'g:image_link', priceField: 'g:price', urlField: 'link' }),
  },
  {
    slug: 'saks-off-fifth',
    name: 'Saks Off 5th',
    baseUrl: 'https://www.saksoff5th.com',
    feedUrl: 'https://productfeed.saksoff5th.com/feed.xml',
    feedType: 'XML',
    affiliateNetwork: 'rakuten',
    category: 'off-price',
    parser: (raw) => parseRssFeed(raw, { idField: 'g:id', imageField: 'g:image_link', priceField: 'g:price', urlField: 'link' }),
  },
  {
    slug: 'neiman-marcus',
    name: 'Neiman Marcus',
    baseUrl: 'https://www.neimanmarcus.com',
    feedUrl: 'https://productfeed.neimanmarcus.com/feed.xml',
    feedType: 'XML',
    affiliateNetwork: 'rakuten',
    category: 'luxury-department',
    parser: (raw) => parseRssFeed(raw, { idField: 'g:id', imageField: 'g:image_link', priceField: 'g:price', urlField: 'link' }),
  },
  {
    slug: 'tj-maxx',
    name: 'TJ Maxx',
    baseUrl: 'https://www.tjmaxx.tjx.com',
    feedUrl: 'https://productfeed.tjmaxx.com/feed.xml',
    feedType: 'XML',
    affiliateNetwork: 'none',
    category: 'off-price',
    parser: (raw) => parseRssFeed(raw, { idField: 'g:id', imageField: 'g:image_link', priceField: 'g:price', urlField: 'link' }),
  },
];

// ── Retailer-specific JSON parsers (lightweight adapters) ────

function parseZaraJson(raw: unknown): import('./types').NormalizedProduct[] {
  try {
    const data = raw as { productGroups?: { elements?: { commercialComponents?: { id: number; name: string; description: string; price: number; images?: { url: string }[]; seo?: { keyword: string } }[] }[] }[] };
    const products: import('./types').NormalizedProduct[] = [];
    for (const group of data.productGroups ?? []) {
      for (const el of group.elements ?? []) {
        for (const comp of el.commercialComponents ?? []) {
          products.push({
            externalId: String(comp.id),
            title: comp.name,
            description: comp.description,
            price: comp.price / 100,
            imageUrl: comp.images?.[0]?.url,
            productUrl: `https://www.zara.com/us/en/${comp.seo?.keyword}-p${comp.id}.html`,
            brand: 'Zara',
            category: 'fashion',
          });
        }
      }
    }
    return products;
  } catch { return []; }
}

function parseHmJson(raw: unknown): import('./types').NormalizedProduct[] {
  try {
    const data = raw as { results?: { code: string; name: string; price: { value: number }; images?: { url: string }[]; link?: string }[] };
    return (data.results ?? []).map((p) => ({
      externalId: p.code,
      title: p.name,
      price: p.price.value,
      imageUrl: p.images?.[0]?.url,
      productUrl: `https://www2.hm.com${p.link ?? ''}`,
      brand: 'H&M',
      category: 'fashion',
    }));
  } catch { return []; }
}

function parseUniqloJson(raw: unknown): import('./types').NormalizedProduct[] {
  try {
    const data = raw as { result?: { items?: { productId: string; name: string; prices: { base: { value: number } }; images: { main: { image?: { url: string } }[] } }[] } };
    return (data.result?.items ?? []).map((p) => ({
      externalId: p.productId,
      title: p.name,
      price: p.prices.base.value,
      imageUrl: p.images.main?.[0]?.image?.url,
      productUrl: `https://www.uniqlo.com/us/en/products/${p.productId}.html`,
      brand: 'Uniqlo',
      category: 'fashion',
    }));
  } catch { return []; }
}

function parseTargetJson(raw: unknown): import('./types').NormalizedProduct[] {
  try {
    const data = raw as { data?: { search?: { products?: { items?: { tcin: string; item?: { product_description?: { title?: string }; primary_image_alt_text?: string }; price?: { current_retail?: number }; item?: { enrichment?: { buy_url?: string }; product_description?: { title?: string } }; primary_image?: { url?: string } }[] } } } };
    return (data.data?.search?.products?.items ?? []).map((p) => ({
      externalId: p.tcin,
      title: p.item?.product_description?.title ?? 'Product',
      price: p.price?.current_retail ?? 0,
      imageUrl: p.primary_image?.url,
      productUrl: p.item?.enrichment?.buy_url ?? `https://www.target.com/p/-/A-${p.tcin}`,
      brand: 'Target',
      category: 'department',
    }));
  } catch { return []; }
}

function parseWalmartJson(raw: unknown): import('./types').NormalizedProduct[] {
  try {
    const data = raw as { items?: { usItemId: string; name: string; price: number; imageUrl?: string; productPageUrl?: string; brand?: string }[] };
    return (data.items ?? []).map((p) => ({
      externalId: p.usItemId,
      title: p.name,
      price: p.price,
      imageUrl: p.imageUrl,
      productUrl: `https://www.walmart.com${p.productPageUrl ?? ''}`,
      brand: p.brand,
      category: 'general',
    }));
  } catch { return []; }
}

function parseSheinJson(raw: unknown): import('./types').NormalizedProduct[] {
  try {
    const data = raw as { info?: { products?: { goods_id: number; goods_name: string; retailPrice: { amount: string }; goods_img: string; goods_url_name: string }[] } };
    return (data.info?.products ?? []).map((p) => ({
      externalId: String(p.goods_id),
      title: p.goods_name,
      price: parseFloat(p.retailPrice.amount),
      imageUrl: `https://img.ltwebstatic.com/images3_pi/${p.goods_img}`,
      productUrl: `https://www.shein.com/${p.goods_url_name}-p-${p.goods_id}.html`,
      brand: 'SHEIN',
      category: 'fashion',
    }));
  } catch { return []; }
}

function parseAmazonApi(raw: unknown): import('./types').NormalizedProduct[] {
  try {
    const data = raw as { SearchResult?: { Items?: { ASIN: string; ItemInfo?: { Title?: { DisplayValue?: string } }; Offers?: { Listings?: { Price?: { DisplayAmount?: string; Amount?: number } }[] }; Images?: { Primary?: { Large?: { URL?: string } } }; DetailPageURL?: string }[] } };
    return (data.SearchResult?.Items ?? []).map((item) => ({
      externalId: item.ASIN,
      title: item.ItemInfo?.Title?.DisplayValue ?? 'Product',
      price: item.Offers?.Listings?.[0]?.Price?.Amount ?? 0,
      imageUrl: item.Images?.Primary?.Large?.URL,
      productUrl: item.DetailPageURL ?? `https://www.amazon.com/dp/${item.ASIN}`,
      brand: 'Amazon',
      category: 'general',
    }));
  } catch { return []; }
}

function parseEbayJson(raw: unknown): import('./types').NormalizedProduct[] {
  try {
    const data = raw as { findItemsByKeywordsResponse?: { searchResult?: { item?: { itemId: string[]; title: string[]; sellingStatus?: { currentPrice?: { __value__: string }[] }[]; galleryURL?: string[]; viewItemURL?: string[] }[] }[] }[] };
    const items = data.findItemsByKeywordsResponse?.[0]?.searchResult?.[0]?.item ?? [];
    return items.map((item) => ({
      externalId: item.itemId[0],
      title: item.title[0],
      price: parseFloat(item.sellingStatus?.[0]?.currentPrice?.[0]?.__value__ ?? '0'),
      imageUrl: item.galleryURL?.[0],
      productUrl: item.viewItemURL?.[0] ?? `https://www.ebay.com/itm/${item.itemId[0]}`,
      brand: 'eBay',
      category: 'marketplace',
    }));
  } catch { return []; }
}
