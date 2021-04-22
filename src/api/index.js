const storage = localStorage

function element_in_view(element) {
    const height = window.innerHeight || document.documentElement.clientHeight
    const width = window.innerWidth || document.documentElement.clientWidth
    var { top, left, bottom, right } = element.getBoundingClientRect()
    right = Math.floor(right);
    bottom = Math.floor(bottom);
    // console.log({ left, top, right, bottom, width, height }) right,bottom 有小数点
    return top >= 0 && left >= 0 &&
        bottom <= height &&
        right <= width
}

function check_storage(url) {
    return storage[url];
}

function get_form_data(args) {
    var formData = new FormData();
    Object.keys(args).forEach(k => formData.append(k, args[k]))
    return formData;
}

function ptwx_chapter_ajax(url, callback, forceUpdate) {
    if (!forceUpdate && storage[url]) {
        return callback(JSON.parse(storage[url]))
    }

    console.time('ptwx_chapter_ajax')
    jQuery.post('/ajax.php', {
        url,
        re: '/(?:&nbsp;){4}(.*?)(?:(?:<br \\/>)|(?:\r\n))+/ims',
        i: 1
    }).then(json => {
        console.timeEnd('ptwx_chapter_ajax')
        console.log('ptwx_chapter_ajax', json.matches.slice(-2))

        var list = json.matches
        storage[url] = JSON.stringify(list)
        return callback(list)
    })
}

function ptwx_novel_ajax(url, callback, forceUpdate) {
    if (!forceUpdate && storage[url]) {
        return callback(JSON.parse(storage[url]))
    }
    console.time('ptwx_novel_ajax')
    jQuery.post('/ajax.php', {
        url,
        re: '/<li><a href="(.*?)<\\/a><\\/li>/ims',
        i: 1
    }).then(json => {
        console.timeEnd('ptwx_novel_ajax')
        console.log('ptwx_novel_ajax', json.matches.slice(-2))

        var list = json.matches.map(href_title => {
            var [href, title] = href_title.split('">')
            href = `${url}/${href}`
            return { title, href }
        });
        storage[url] = JSON.stringify(list)
        return callback(list)
    })
}

function ptwx_novel_info_ajax(url, callback) { // 不要 cache 网址重复
    console.time('ptwx_novel_info_ajax')
    jQuery.post('/ajax.php', {
        url,
        re: '/content="(\\S+版权属于作者\\S+)"/ims',
        i: 1
    }).then(json => {
        console.timeEnd('ptwx_novel_info_ajax')
        console.log('ptwx_novel_info_ajax', json.matches.slice(-2))

        // novel author
        var list = json.matches[0].split('版权属于作者');
        return callback(list)
    })
}

function copy2clip(str) {
    const el = document.createElement('textarea')
    el.value = str
    el.setAttribute('readonly', '')
    el.style.position = 'absolute'
    el.style.left = '-9999px'
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
}

export {
    ptwx_chapter_ajax,
    ptwx_novel_ajax,
    ptwx_novel_info_ajax,
    element_in_view,
    check_storage,
}