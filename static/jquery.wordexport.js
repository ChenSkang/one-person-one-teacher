/**
 * Created by getYou on 2018/8/16.
 */
/* eslint-disable */
if (typeof jQuery !== "undefined" && typeof saveAs !== "undefined") {
  (function($) {
    $.fn.wordExport = function(fileName) {
      fileName = typeof fileName !== 'undefined' ? fileName : "jQuery-Word-Export";
      var static = {
        mhtml: {
          top: "Mime-Version: 1.0\nContent-Base: " + location.href + "\nContent-Type: Multipart/related; boundary=\"NEXT.ITEM-BOUNDARY\";type=\"text/html\"\n\n--NEXT.ITEM-BOUNDARY\nContent-Type: text/html; charset=\"utf-8\"\nContent-Location: " + location.href + "\n\n<!DOCTYPE html>\n<html>\n_html_</html>",
          head: "<head>\n<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">\n<style>\n_styles_\n</style>\n</head>\n",
          body: "<body>_body_</body>"
        }
      };
      var options = {
        maxWidth: 624
      };
      // Clone selected element before manipulating it
      var markup = $(this).clone();

      // Remove hidden elements from the output
      markup.each(function() {
        var self = $(this);
        if (self.is(':hidden'))
          self.remove();
      });
      function imgToDataUrl(){
        var charImg = document.all("exportdom").getElementsByTagName("img");
        var imgURLs = "";
        for (var i = 0; i < charImg.length; i++) {
          var imgURL = charImg[i].currentSrc;
          getBase64(imgURL,charImg[i]);
        }
      }
      function getBase64(url,charImg){
        var Img = new Image();
        Img.crossOrigin = "Anonymous";//跨域必须使用，且后台也得设置允许跨域
        dataURL='';
        Img.src=url;
        Img.onload=function(){ //要先确保图片完整获取到，这是个异步事件
          var canvas = document.createElement("canvas"), //创建canvas元素
            width=Img.width, //确保canvas的尺寸和图片一样
            height=Img.height;
          canvas.width=width;
          canvas.height=height;
          canvas.getContext("2d").drawImage(Img,0,0,width,height); //将图片绘制到canvas中
          dataURL=canvas.toDataURL('image/jpg'); //转换图片为dataURL
          condataurl?condataurl(dataURL,charImg):null; //调用回调函数
        };
      }
      function condataurl(dataURL,charImg){
        charImg.src=dataURL;
        //console.log(charImg);
      }
      // Embed all images using Data URLs
      var images = Array();
      var img = markup.find('img');
      for (var i = 0; i < img.length; i++) {
        // Calculate dimensions of output image
        var w = Math.min(img[i].width, options.maxWidth);
        var h = img[i].height * (w / img[i].width);
        // Create canvas for converting image to data URL
        var canvas = document.createElement("CANVAS");
        canvas.width = w;
        canvas.height = h;
        // Draw image to canvas
        var context = canvas.getContext('2d');
        context.drawImage(img[i], 0, 0, w, h);
        // Get data URL encoding of image
        var uri = canvas.toDataURL("image/png");
        $(img[i]).attr("src", img[i].src);
        img[i].width = w;
        img[i].height = h;
        // Save encoded image to array
        images[i] = {
          type: uri.substring(uri.indexOf(":") + 1, uri.indexOf(";")),
          encoding: uri.substring(uri.indexOf(";") + 1, uri.indexOf(",")),
          location: $(img[i]).attr("src"),
          data: uri.substring(uri.indexOf(",") + 1)
        };
      }

      // Prepare bottom of mhtml file with image data
      var mhtmlBottom = "\n";
      for (var i = 0; i < images.length; i++) {
        mhtmlBottom += "--NEXT.ITEM-BOUNDARY\n";
        mhtmlBottom += "Content-Location: " + images[i].location + "\n";
        mhtmlBottom += "Content-Type: " + images[i].type + "\n";
        mhtmlBottom += "Content-Transfer-Encoding: " + images[i].encoding + "\n\n";
        mhtmlBottom += images[i].data + "\n\n";
      }
      mhtmlBottom += "--NEXT.ITEM-BOUNDARY--";

      //TODO: load css from included stylesheet
      var styles = ".fS4{font-family:MathJax_Size4;font-weight:400;font-style:normal}.math{display:inline;text-align:left;word-spacing:normal;word-wrap:normal;white-space:nowrap;float:none;direction:ltr;margin:0 .2em}.math nobr{text-decoration:none}.math nobr>.pS{padding:.2em 0}.math span{display:inline;position:static;border:0;padding:0;margin:0;vertical-align:0;line-height:normal;text-decoration:none}img{max-width:100%;vertical-align:middle}table{border-spacing:0}table.tB{border-top:solid 1px #999;border-left:solid 1px #999;border-radius:4px}table.tB>tbody>tr:first-child>td{border-top:0}table.tB>tbody>tr:first-child>td:first-child{border-top-left-radius:4px}table.tB>tbody>tr:first-child>td:last-child{border-top-right-radius:4px}table.tB>tbody>tr:last-child>td:first-child{border-bottom-left-radius:4px}table.tB>tbody>tr:last-child>td:last-child{border-bottom-right-radius:4px}table.tB>tbody>tr:nth-child(odd){background:#F5F5F5}table.tB>tbody>tr>td{border-right:solid 1px #999;border-bottom:solid 1px #999;padding:0 4px;text-align:center}span.special-symbol{font-family:arial,tahoma,'\5b8b\4f53',sans-serif;line-height:1}span.dI{display:inline-block}span.pA{position:absolute}span.pR{position:relative}span.pS{position:static}span.oH{overflow:hidden}span.emptyblank{position:relative;display:-moz-inline-box;-moz-box-orient:vertical;display:inline-block;*zoom:1;*display:inline;height:1em;width:2em;margin-left:3px;margin-right:3px;border-bottom:1px solid #000}.MathZyb{letter-spacing:1px;white-space:nowrap;word-spacing:normal;word-wrap:normal;display:inline-block}.MathZyb div,.MathZyb span{height:auto;white-space:normal}.MathZyb table{border-collapse:collapse;display:inline-block;text-align:center;vertical-align:middle;}.MathZyb table td{line-height:normal;white-space:nowrap;border:0 none;width:auto;padding:0}.MathZybm{font-style:italic}table.edittable{border-top:solid 1px #999;border-left:solid 1px #999;border-radius:4px}table.edittable>tbody>tr:first-child>td{border-top:0}table.edittable>tbody>tr:first-child>td:first-child{border-top-left-radius:4px}table.edittable>tbody>tr:first-child>td:last-child{border-top-right-radius:4px}table.edittable>tbody>tr:last-child>td:first-child{border-bottom-left-radius:4px}table.edittable>tbody>tr:last-child>td:last-child{border-bottom-right-radius:4px}table.edittable>tbody>tr:nth-child(odd){background:#F5F5F5}table.edittable>tbody>tr>td{border-right:solid 1px #999;border-bottom:solid 1px #999;padding:0 4px;text-align:center}.composition{border-collapse:collapse;text-align:left;margin:2px;width:100%}.flipv{-webkit-transform:scaleX(-1);-ms-transform:scaleX(-1);transform:scaleX(-1)}.zyb_option *{vertical-align:middle}.zyb_option .zyb_option_titie{display:inline-block;margin-right:1em}bdo.mathjye-aligncenter{display:block;text-align:center}bdo.mathjye-alignright{display:block;text-align:right}bdo.mathjye-alignleft{display:block;text-align:left}bdo.mathjye-underline{padding-bottom:2px;border-bottom:1px solid #000}.set_title{width: 100%;height: 45px;line-height: 45px;font-size: 1rem;text-align: center;background-color: #EBEEF5;border-bottom: 1px solid #E4E7ED;margin-bottom: 10px;}.exam_left img{position: absolute;left: 7px;top: 0;}.exam_name{width: 100%;text-align: center;border: 1px solid #fff;}.exam_name:hover{background-color: #FEF7D7;border: 1px solid #CCC;}.exam_name:focus{background-color: #FEF7D7;border: 1px solid #fff;}.exam_name1{font: 1.375rem Arial bold;line-height: 40px;}.exam_name2{font: 1.125rem Arial;line-height: 1.5em;}.exam_name3{font: 0.875rem 微软雅黑;height: 50px;line-height: 50px;}.exam_name4{font: 0.875rem 微软雅黑;line-height: 1.5em;}.scores{margin: 15px 0;}.scores table{border-collapse: collapse;margin: 0 auto;}.scores table td{width: 50px;height: 25px;text-align: center;font-size: 0.75rem;}.attentions{width: 100%;color: #999999;font-size: 0.75rem;margin-bottom: 5mm;}.attentions span{font-size: 0.9375rem;}.attentions p{line-height: 20px;}.ques{position: relative;width: 100%;zoom: 1;clear: both;box-sizing: border-box;border: 1px solid #ffffff;transition: 0.5s;}.up{line-height: 25px;font-size: 0.875rem;padding: 20px 20px 10px 20px;}.jx{color: #409EFF;font-weight: bold;}.low{display: none;}.item-ul::-webkit-scrollbar{width: 0;}.TM{font-family: 新宋体;font-weight: bold;font-size: 1.0625rem;}";

      // Aggregate parts of the file together
      var fileContent = static.mhtml.top.replace("_html_", static.mhtml.head.replace("_styles_", styles) + static.mhtml.body.replace("_body_", markup.html())) + mhtmlBottom;

      // Create a Blob with the file contents
      var blob = new Blob([fileContent], {
        type: "application/msword;charset=utf-8"
      });
      saveAs(blob, fileName + ".doc");
    };
  })(jQuery);
} else {
  if (typeof jQuery === "undefined") {
    console.error("jQuery Word Export: missing dependency (jQuery)");
  }
  if (typeof saveAs === "undefined") {
    console.error("jQuery Word Export: missing dependency (FileSaver.js)");
  }
}
