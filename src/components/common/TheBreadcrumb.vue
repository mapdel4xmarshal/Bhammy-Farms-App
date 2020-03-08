<template>
  <ul class="breadcrumb">
    <li class="breadcrumb__link"
      v-for="p in getCurrentPath"
        :key="p.name">
      <router-link :to="p.path" exact-active-class="active">{{p.name}}</router-link>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'Breadcrumb',
  computed: {
    getCurrentPath() {
      const paths = {};
      let path;
      this.$route.matched.forEach((route) => {
        path = route.path.endsWith('/') ? route.path.replace(/\/$/, '') : route.path;
        const normalizedPath = route.path.substring(route.path.lastIndexOf('/') + 1);

        if (!paths[path]) {
          paths[path] = {
            name: normalizedPath.charAt(0).toUpperCase() + normalizedPath.slice(1),
            path,
          };
        }
      });
      return paths;
    },
  },
};
</script>

<style lang="scss" scoped>
  .breadcrumb {
    display: inline-flex;
    padding: 0;
    list-style: none;
    margin: 0;

    &__link {
      display: inline;
      font-size: 14px;
    }

    & li+li:before {
      padding: 8px;
      color: black;
      content: "|";
      font-size: 13px;
    }

    & li a {
      color: var(--base-color);
      text-decoration: none;

      &:hover {
        color: #01447e;
        text-decoration: underline;
      }
    }
  }

  .active{
    pointer-events: none;
    cursor: default;
  }
</style>
