<template>
  <div id="app" class="container">
    <ot-navbar class="mt-3 mb-5" />
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>
<script>
import otNavbar from "@/components/Navbar";

export default {
  components: {
    otNavbar,
  },
};
</script>
<style>
:root {
  --font-size: 16px;
}

a {
  color: var(--dark);
}
.bg-dark a {
  color: var(--light);
}
a:hover {
  text-decoration: none;
}

.sticky-bottom {
  bottom: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 2;
}

#app {
  color: #2c3e50;
}

body.bg-dark #app {
  color: var(--light);
}

body.custom-bg-color:not(.bg-dark) {
  background-color: var(--bg-color);
}

body.bg-dark .btn:not(.btn-primary) {
  color: var(--light);
  background-color: var(--dark);
  border-color: var(--dark);
}

body.bg-dark .card {
  background-color: var(--dark);
  /* border-color: var(--light); */
  border-color: white;
}
</style>
