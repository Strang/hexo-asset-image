'use strict';
var cheerio = require('cheerio');

hexo.extend.filter.register('after_post_render', function (data) {
  var config = hexo.config;
  if (config.post_asset_folder) {
    var toprocess = ['excerpt', 'more', 'content'];
    for (var i = 0; i < toprocess.length; i++) {
      var key = toprocess[i];
      var $ = cheerio.load(data[key], {
        ignoreWhitespace: false,
        xmlMode: false,
        lowerCaseTags: false,
        decodeEntities: false,
      });

      $('img').each(function () {
        if ($(this).attr('src')) {
          // For windows style path, we replace '\' to '/'.
          var from = $(this).attr('src').replace('\\', '/');
          if (!(/http[s]*.*|\/\/.*/.test(from)
            || /^\s+\//.test(from)
            || /^\s*\/uploads|images\//.test(from))) {
            var to = from.slice(from.lastIndexOf('/') + 1);
            $(this).attr('src', to);
            console.info && console.info("INFO  Update link: " + from + " --> " + to);
          }
        } else {
          console.info && console.info("INFO  No src attr, skipped...");
          console.info && console.info($(this));
        }
      });
      data[key] = $.html();
    }
  }
});
