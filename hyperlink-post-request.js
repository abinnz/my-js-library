/*
    hyperlink post request jquery plugin
    ----------------------------------------------------------
    Description: Convert hyperlink GET request to POST request
    Author: Abinnz
    Version: 1.0.0
    Date: 2017/11/23
*/
(function ($) {

    $.fn.extend({
        "convertPostRequest": function (opts) {
            var defaults = {
                "formId": "_hyperlinkForm",
                "target": "_blank"
            };
            var options = $.extend({}, defaults, opts);
            //创建隐藏表单
            var $form = createHiddenForm(options);
            this.each(function (index) {
                var $this = $(this);
                //检查a标签
                if (isInvalidHyperlink($this)) {
                    return $this;
                }
                //绑定a标签点击事件
                $this.bind("click", {
                    $this: $this,
                    $form: $form,
                    options: options
                }, execHyerplinkClickEvent);
                return $this;
            });
            return this;
        }
    });

    //检查a标签
    function isInvalidHyperlink($this) {
        if ($this.get(0).nodeName.toUpperCase() !== "A") {
            return true;
        }
        if ($this.attr("href") === undefined) {
            return true;
        }
        return false;
    }

    //创建隐藏表单
    function createHiddenForm(options) {
        if ($("#" + options.formId).size() === 0) {
            $("body").append("<form id='" + options.formId + "' method='post' target='" +
                options.target + "' style='display: none;'>" +
                "</form>");
        }
        return $("#" + options.formId);
    }

    //a标签点击事件
    function execHyerplinkClickEvent(event) {
        var $this = event.data.$this;
        var $form = event.data.$form;
        var targetAttr = event.data.options.target;
        var offset = $this.attr("href").indexOf("?");
        //不带请求参数
        if (offset === -1) {
            $this.attr("target", targetAttr);
            return true;
        }
        //带请求参数
        var queryArray = $this.attr("href").substring(offset + 1).split("&");
        $form.attr("action", $this.attr("href").substring(0, offset));
        $form.empty();
        for (var i = 0; i < queryArray.length; i++) {
            var inputProp = queryArray[i].split("=");
            if (inputProp.length === 2) {
                $form.append("<input name='" + inputProp[0] + "' value='" + inputProp[1] + "' />");
            }
        }
        $form.submit();
        return false;
    }

})(jQuery);