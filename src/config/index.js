import { ptwx_chapter_ajax, ptwx_novel_ajax, ptwx_novel_info_ajax } from "@/api"

const storage = localStorage;
var AppConfig = storage.config
    ? JSON.parse(storage.config)
    : {
        bgColor: "#f8f9fa",
        bgColorEnable: false,
        speechEnable: false,
        follow: false,
        fontSize: 16,
        darkMode: false,
        forceUpdate: false,
        speechPitch: 0.9,
        speechRate: 2,
        autoPlay: false,
        novels: [
            {
                title: "放开那个女巫",
                author: '二目',
                href: "https://www.ptwxz.com/html/8/8025/",
                history: -1,
            },
        ],
    };

const AppController = {
    save_config() {
        console.log('save config');
        storage.config = JSON.stringify(AppConfig)
    },
    clear_cache() {
        storage.clear();
    },
    clear_novel_cache(href) {
        Object.keys(storage).forEach(k => k.startsWith(href) && storage.removeItem(k))
    },
    init() {
        var config = AppConfig
        config.speechEnable = config.speechEnable || false
        config.autoPlay = config.autoPlay || false
        config.follow = config.follow || false
        config.speechPitch = config.speechPitch || 0.9
        config.speechRate = config.speechRate || 1
        config.forceUpdate = config.forceUpdate || false
        config.bgColor = config.bgColor || ""
        config.bgColorEnable = config.bgColorEnable || false
        config.darkMode = config.darkMode || false
        config.fontSize = config.fontSize || 16

        config.novels.forEach(novel => {
            if (!('history' in novel)) {
                novel.history = -1;
            }
        })
    },
    get_novel_info(href, callback) {
        if (href && href.match(/^https:\/\/www.ptwxz.com\/html\/\d+\/\d+\/$/i)) {
            ptwx_novel_info_ajax(href, novel_info => {
                var [title, author] = novel_info
                var history = -1
                callback({
                    title,
                    author,
                    href,
                    history,
                })
                AppController.save_config();
            })
        }
    },
    get_novel_chapters(novel_href, callback) {
        if (novel_href) {
            ptwx_novel_ajax(
                novel_href,
                chapters => {
                    callback(chapters)
                    AppController.save_config();
                },
                navigator.onLine && AppConfig.forceUpdate
            );
        }
    },
    get_novel_chapter_paragraphs(chapter_url, callback) {
        if (chapter_url) {
            ptwx_chapter_ajax(
                chapter_url,
                paragraphs => {
                    var $div = jQuery("<div>");
                    callback(paragraphs.map((p) =>
                        $div.html(p).text().trim()
                    ))
                    AppController.save_config()
                },
                navigator.onLine && AppConfig.forceUpdate
            );
        }
    },
}
AppController.init()

export {
    AppConfig, AppController
};