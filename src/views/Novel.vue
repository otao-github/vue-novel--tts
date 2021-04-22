<template>
  <div class="home" v-if="Novel">
    <h1 class="text-center">{{ Novel.title }}</h1>

    <ot-configurator class="mb-5" />

    <div class="text-right">
      <div class="btn-group btn-group-sm">
        <button
          class="btn btn-light"
          @click="revertChapters = !revertChapters"
          v-text="revertChapters ? '倒序' : '正序'"
        ></button>
        <button
          class="btn btn-light"
          @click="caching ? (caching = false) : cache_all()"
          v-text="caching ? '停止' : '缓存'"
        ></button>
      </div>
    </div>

    <div id="chapter-container" class="row mt-3" v-if="chapters">
      <router-link
        class="chatper my-2 pl-4 pr-2 col-12 col-sm-6 col-md-4 col-lg-3"
        :to="`/novel/${novelId}/chapter/${view.id}`"
        v-for="view in ChapterViews"
        :key="view.id"
        :id="`chapter-${view.id}`"
        :class="{ 'text-primary': view.id <= Novel.history }"
      >
        {{ view.chapter.title }}
        <span v-show="view.chapter.cached" class="text-success">✔</span>
      </router-link>
    </div>

    <div
      class="float-control d-sm-block text-right position-sticky sticky-bottom"
    >
      <div class="btn-group btn-group-sm">
        <button class="btn btn-light" @click="scroll(0)">顶部</button>
        <button class="btn btn-light" @click="scroll(1)">底部</button>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { AppController as controller, AppConfig as config } from "@/config";
import { check_storage, element_in_view } from "@/api";
import otConfigurator from "@/components/Configurator";

const debug = true;

export default {
  components: {
    otConfigurator,
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      var novelId = parseInt(to.params.novelId);
      var chapterId = parseInt(to.query.chapterId);
      debug && console.log("novel enter", novelId, chapterId);

      vm.init(novelId, chapterId);
    });
  },
  beforeRouteUpdate(to, from, next) {
    var novelId = parseInt(to.params.novelId);
    var chapterId = parseInt(to.query.chapterId);
    debug && console.log("novel update", novelId, chapterId);

    this.init(novelId, chapterId);
    next();
  },
  data() {
    return {
      config,
      caching: false,
      chapters: null,
      novelId: null,
      revertChapters: true,
    };
  },
  methods: {
    scroll_into_chapter(chapterId) {
      debug && console.log("novel scroll", this.valid_chapter(chapterId));
      if (this.valid_chapter(chapterId)) {
        this.$nextTick(() => {
          var ch = document.querySelector(`#chapter-${chapterId}`);
          debug &&
            console.log("novel chapter_in_view", ch && element_in_view(ch));
          if (ch && !element_in_view(ch)) {
            ch.scrollIntoView();
          }
        });
      }
    },
    init(novelId, chapterId) {
      window.scrollTo(0, 0);

      if (this.novelId === novelId) {
        this.chapters.forEach((ch) => {
          ch.cached = check_storage(ch.href);
        });
        this.scroll_into_chapter(chapterId);
        return;
      }

      this.novelId = novelId;
      this.chapters = null;
      controller.get_novel_chapters(this.Novel.href, (chapters) => {
        this.chapters = chapters.map((ch) => {
          ch.cached = check_storage(ch.href);
          return ch;
        });
        this.scroll_into_chapter(chapterId);
      });
    },
    valid_chapter(i) {
      return this.chapters && i >= 0 && i < this.chapters.length;
    },
    scroll(offset) {
      this.$nextTick(() => {
        window.scrollTo(0, document.scrollingElement.offsetHeight * offset);
      });
    },
    cache_all() {
      var cache_chapter = (i) => {
        if (this.valid_chapter(i) && this.caching) {
          var ch = this.chapters[i];
          if (!ch.cached) {
            controller.get_novel_chapter_paragraphs(ch.href, () => {
              ch.cached = true;
              setTimeout(() => {
                cache_chapter(i + 1);
              }, 50);
            });
          } else {
            cache_chapter(i + 1);
          }
        }
      };
      this.caching = true;
      cache_chapter(0);
    },
  },
  computed: {
    Novel() {
      return this.novelId === null ? null : config.novels[this.novelId];
    },
    ChapterViews() {
      var view = this.chapters
        ? this.chapters.map((chapter, id) => ({ id, chapter }))
        : [];
      if (this.revertChapters) {
        view = view.reverse();
      }
      return view;
    },
  },
};
</script>