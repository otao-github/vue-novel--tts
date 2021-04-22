<template>
  <nav id="navbar" class="d-flex text-center font-weight-bold justify-content-center">
    <div v-for="(item, idx) in items" :key="idx">
      <span v-show="idx" class="mx-3">/</span>
      <router-link :to="item.to()">{{ item.name }}</router-link>
    </div>
  </nav>
</template>

<script>
// @ is an alias to /src
const debug = false;
export default {
  name: "Navbar",
  data() {
    var default_items = [
      {
        name: "关于",
        to: () => "/about",
      },
    ];
    return {
      default_items,
      items: Object.create(default_items),
    };
  },
  watch: {
    $route(to, from) {
      debug && console.log("Nav watch.$route", to, this.$router);
      var items = [];
      var current_path = to.matched[0].path;
      // debug && console.log("\trouter", this.$router);
      // debug && console.log("\trouter.options", this.$router.options);
      // debug && console.log("\trouter.options.routes", this.$router.options.routes);
      this.$router.options.routes.forEach((route) => {
        var route_path = route.path;
        debug && console.log("\t匹配", current_path, route_path);
        if (current_path.startsWith(route_path)) {
          // 替换参数
          if (route.meta && route.meta.params) {
            route.meta.params.forEach((key) => {
              var re = new RegExp(`:${key}\\b`);
              route_path = route_path.replace(re, to.params[key]);
              // debug && console.log("\t\t参数替换", route_path, re, to.params[key]);
            });
            debug && console.log("\t\t置入参数", route_path);
          }
          items.push({
            name: route.meta.name,
            to: () => route_path,
          });
        }
      });
      if (items.length) {
        this.items = items;
      } else {
        this.items = Object.create(this.default_items);
      }
      // console.log(this.items);
    },
  },
};
</script>
<style>
#navbar a.router-link-exact-active {
  color: var(--primary) !important;
}
</style>