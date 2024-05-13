// ==UserScript==
// @name            Jira标题拷贝按钮
// @namespace       https://izmj.net/
// @version         0.5
// @description     在JIRA页面，快速拷贝标题到剪贴板
// @author          GiraKoo
// @license         MIT
// @match           *://*/browse/*
// @run-at          document-end
// @icon64          https://gitee.com/izmj/web_js/raw/main/img/zmj.png
// ==/UserScript==

// 尝试获取元素，如果不存在则返回null
function getElementByIdSafe(id) {
    return document.getElementById(id) || null;
}

// 尝试添加元素到指定位置，如果父元素不存在则不执行任何操作
function appendElementAfterSafe(newElement, referenceElement) {
    if (referenceElement) {
        referenceElement.after(newElement);
    }
}

// 创建拷贝按钮的ul元素和li元素
var transitions_div = getElementByIdSafe('opsbar-opsbar-transitions');
var jira_copy_title_ul = document.createElement('ul');
jira_copy_title_ul.className = 'toolbar-group pluggable-ops';
jira_copy_title_ul.id = 'jira_copy_title_ul';

var li_copy_title = document.createElement('li');
li_copy_title.className = 'toolbar-item';
li_copy_title.innerHTML = '<a class="toolbar-trigger" href="#" id="jira_copy_title">ID & 标题</a>';
jira_copy_title_ul.appendChild(li_copy_title);

var li_copy_link = document.createElement('li');
li_copy_link.className = 'toolbar-item';
li_copy_link.innerHTML = '<a class="toolbar-trigger" href="#" id="jira_copy_link">链接</a>';
jira_copy_title_ul.appendChild(li_copy_link);

// 安全地添加按钮ul到transitions_div之后
appendElementAfterSafe(jira_copy_title_ul, transitions_div);

// 显示提示信息的函数
function showToast(message) {
    var toastId = 'toast-' + Date.now(); // 为每个toast生成一个唯一的ID
    var div = document.createElement('div');
    div.id = toastId;
    div.style.position = 'fixed';
    div.style.top = '10px';
    div.style.left = '50%';
    div.style.transform = 'translateX(-50%)';
    div.style.padding = '10px';
    div.style.backgroundColor = '#4CAF50';
    div.style.color = 'white';
    div.style.borderRadius = '5px';
    div.style.zIndex = '9999';
    div.innerText = message;

    // 清除可能存在的旧toast
    var oldToast = getElementByIdSafe(toastId);
    if (oldToast) {
        oldToast.parentNode.removeChild(oldToast);
    }

    document.body.appendChild(div);

    // 设置定时器移除toast，并确保在移除前清除事件监听器
    var toastRemovalTimeout = setTimeout(() => {
        var toastToRemove = getElementByIdSafe(toastId);
        if (toastToRemove) {
            toastToRemove.parentNode.removeChild(toastToRemove);
        }
    }, 1000);
}

// 添加事件监听器，将JIRA的ID和标题拷贝到剪贴板
var jira_copy_title_btn = getElementByIdSafe('jira_copy_title');
if (jira_copy_title_btn) {
    jira_copy_title_btn.addEventListener('click', function () {
        var jira_id_element = getElementByIdSafe('key-val');
        var jira_title_element = getElementByIdSafe('summary-val');
        if (jira_id_element && jira_title_element) {
            var jira_id = jira_id_element.innerText;
            var jira_title = jira_title_element.innerText;
            var copy_text = jira_id + ' ' + jira_title;
            navigator.clipboard.writeText(copy_text).then(() => {
                showToast('已拷贝到剪贴板');
            });
        } else {
            console.error('未能找到JIRA ID或标题元素');
        }
    });
}

// 添加事件监听器，将JIRA链接拷贝到剪贴板
var jira_copy_link_btn = getElementByIdSafe('jira_copy_link');
if (jira_copy_link_btn) {
    jira_copy_link_btn.addEventListener('click', function () {
        // 获取key-val元素的href
        var jira_id_element = getElementByIdSafe('key-val');
        var jira_link = jira_id_element ? jira_id_element.href : window.location.href;
        navigator.clipboard.writeText(jira_link).then(() => {
            showToast('已拷贝到剪贴板');
        });
    });
}