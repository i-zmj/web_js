// ==UserScript==
// @name            Jira快速备注模板工具
// @namespace       https://izmj.net/
// @version         0.8.1
// @description     在JIRA页面，搜索comment-wiki-edit元素，在该元素下添加一个select控件。可以快速添加所需的模板。
// @author          GiraKoo
// @license         MIT
// @match           *://*/browse/*
// @run-at          document-end
// @icon64          https://gitee.com/izmj/web_js/raw/main/img/zmj.png
// ==/UserScript==

// 找到一个id为comment-wiki-edit的div
var commentWikiEditDiv = document.getElementById('comment-wiki-edit');
if (commentWikiEditDiv) {
    // 添加一个下拉列表，列表中直接“原因分析”，“解决方案”等常用文本
    var select = document.createElement('select');
    select.innerHTML = `
        <option value="">选择快速模板</option>
        <option value="黄色区块">黄色区块</option>
        <option value="绿色区块">绿色区块</option>
        <option value="红色区块">红色区块</option>
        <option value="蓝色区块">蓝色区块</option>
        <option value="缩略图">缩略图</option>
    `;
    select.style.marginBottom = '10px';
    select.style.padding = '8px';
    select.style.width = '100%';
    select.addEventListener('change', function () {
        var commentBox = document.querySelector('textarea[name="comment"]');
        if (commentBox) {
            // 如果是原因分析区块
            if (select.value === '黄色区块') {
                commentBox.value += "{panel:title=(!) Warning|borderStyle=solid|borderColor=#FF9100|titleBGColor=#FFF4E5|bgColor=#FFFFFF}\n\n{panel}\n";
            }
            else if (select.value === '绿色区块') {
                commentBox.value += "{panel:title=(/) Success|borderStyle=solid|borderColor=#00C853|titleBGColor=#EFFCE7|bgColor=#FFFFFF}\n\n{panel}\n";
            }
            else if (select.value === '红色区块') {
                commentBox.value += "{panel:title=(x) Error|borderStyle=solid|borderColor=#F50057|titleBGColor=#FEE5EE|bgColor=#FFFFFF}\n\n{panel}\n";
            }
            else if (select.value === '蓝色区块') {
                commentBox.value += "{panel:title=(i) Note|borderStyle=solid|borderColor=#448AFF|titleBGColor=#ECF3FF|bgColor=#FFFFFF}\n\n{panel}\n";
            }
            else if (select.value === '缩略图') {
                commentBox.value += "!xxxxxx.png|thumbnail!";
            }
        }
    });
    commentWikiEditDiv.insertBefore(select, commentWikiEditDiv.firstChild);
}
