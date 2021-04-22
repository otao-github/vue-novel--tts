<template>
  <div class="novel-chapter" v-if="Chapter">
    <h2 class="text-center">{{ Chapter.title }}</h2>
    <ot-configurator></ot-configurator>
    <ot-chapter-control class="m-3" :chapterControl="chapterControl" />

    <div
      id="paragraph-contianer"
      class="row d-block text-left"
      v-if="paragraphs"
    >
      <p
        class="col paragraph px-3"
        v-for="(p, idx) in ParagraphViews"
        :key="idx"
        :id="`paragraph-${idx}`"
        @click="read_paragraph(idx)"
        :class="{ active: line === idx }"
        v-text="p"
      ></p>
    </div>

    <ot-chapter-control
      class="m-3"
      :chapterControl="chapterControl"
      v-show="paragraphs"
    />

    <ot-audio-control
      class="position-sticky sticky-bottom"
      @play="read_paragraph(0)"
      @stop="stop_reading()"
    ></ot-audio-control>
  </div>
</template>

<script>
// @ is an alias to /src
import { AppConfig as config, AppController as controller } from "@/config";
import { element_in_view, check_storage } from "@/api";
import otChapterControl from "@/components/ChapterControl";
import otConfigurator from "@/components/Configurator";
import otAudioControl from "@/components/AudioControl";

var debug = false;

var tts = new SpeechSynthesisUtterance();
tts.volume = 1; // From 0 to 1

const isIOS = navigator.userAgent.match(/iphone/i);

export default {
  components: {
    otChapterControl,
    otConfigurator,
    otAudioControl,
  },
  data() {
    return {
      config,
      novelId: null,
      chapterId: null,
      chapters: null,
      paragraphs: null,
      line: null,
      chapterControl: {
        prev: {
          disabled: () => !this.valid_chapter(this.chapterId - 1),
          to: () => `/novel/${this.novelId}/chapter/${this.chapterId - 1}`,
          name: "上一章",
        },
        back: {
          disabled: () => !this.Novel,
          to: () => `/novel/${this.novelId}/?chapterId=${this.chapterId}`,
          name: "目录",
        },
        next: {
          disabled: () => !this.valid_chapter(this.chapterId + 1),
          to: () => `/novel/${this.novelId}/chapter/${this.chapterId + 1}`,
          name: "下一章",
        },
      },
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      var novelId = parseInt(to.params.novelId);
      var chapterId = parseInt(to.params.chapterId);
      debug && console.log("chapter enter", novelId, chapterId);

      vm.init(novelId, chapterId);
    });
  },
  beforeRouteUpdate(to, from, next) {
    var novelId = parseInt(to.params.novelId);
    var chapterId = parseInt(to.params.chapterId);
    debug && console.log("chapter update", novelId, chapterId);

    this.init(novelId, chapterId);
    next();
  },
  beforeRouteLeave(to, from, next) {
    this.stop_reading();
    next();
  },
  methods: {
    init(novelId, chapterId) {
      window.scrollTo(0, 0);
      this.stop_reading();

      if (this.novelId === novelId && this.chapterId === chapterId) {
        return;
      }

      if (novelId >= 0 && chapterId >= 0) {
        console.log("chapter setHistory", novelId, chapterId);
        config.novels[novelId].history = chapterId; // set last viewed chapterId
      }

      this.novelId = novelId;
      this.chapterId = chapterId;

      this.chapters = null;
      this.paragraphs = null;

      controller.get_novel_chapters(this.Novel.href, (chapters) => {
        this.chapters = chapters;

        controller.get_novel_chapter_paragraphs(
          this.Chapter.href,
          (paragraphs) => {
            this.paragraphs = paragraphs;
            if (config.autoPlay) {
              this.read_paragraph(0);
            }
          }
        );
      });
    },
    valid_chapter(i) {
      return this.chapters && i >= 0 && i < this.chapters.length;
    },
    valid_paragraph(i) {
      return this.paragraphs && i >= 0 && i < this.paragraphs.length;
    },
    read_paragraph(l) {
      this.stop_reading();

      if (config.speechEnable && this.valid_paragraph(l)) {
        // 滚动到视图
        config.follow &&
          this.$nextTick(() => {
            var p = document.querySelector(`#paragraph-${l}`);
            debug && console.log("chapter p_in_view", p && element_in_view(p));
            if (p && !element_in_view(p)) {
              p.scrollIntoView();
            }
          });

        this.line = l;
        tts.text = this.ParagraphViews[l];
        tts.pitch = Math.max(Math.min(config.speechPitch, 1.2), 0.8); // From 0.5 to 10
        tts.rate = Math.max(Math.min(config.speechRate, 10), 0.5); // From 0.5 to 10
        debug && console.log("read", l, tts.text);

        tts.onend = () => {
          if (this.valid_paragraph(l + 1)) {
            debug && console.log("onend next_paragraph", l);
            this.read_paragraph(l + 1);
          } else if (
            config.autoPlay &&
            this.valid_chapter(this.chapterId + 1)
          ) {
            debug && console.log("onend next_chapter", l);
            this.$router.push(this.chapterControl.next.to());
          } else {
            debug && console.log("onend stop_reading", l);
            this.stop_reading();
          }
        };
        if (isIOS) {
          setTimeout(function () {
            speechSynthesis.speak(tts);
          }, 200);
        } else {
          speechSynthesis.speak(tts);
        }
      }
    },
    stop_reading() {
      this.line = null;
      tts.onend = null;
      speechSynthesis.cancel();
    },
  },
  computed: {
    Novel() {
      return this.novelId === null ? null : config.novels[this.novelId];
    },
    Chapter() {
      return this.chapters && this.chapters[this.chapterId];
    },
    ParagraphViews() {
      var paragraphs = this.paragraphs || null;
      return paragraphs;
    },
  },
};
</script>
<style>
.paragraph {
  font-size: var(--font-size);
}
body:not(.bg-dark) #paragraph-contianer .paragraph.active {
  background-color: rgba(255, 166, 0, 0.705);
}
body.bg-dark #paragraph-contianer .paragraph.active {
  color: orange;
}
</style>