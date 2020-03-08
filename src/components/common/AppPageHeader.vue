<template>
  <header class="page-header">
    <the-breadcrumb class="page-header__items"/>
    <div class="page-header__search page-header__items">
      <slot name="search">
        <v-text-field v-if="hasSearch"
                      label="Search"
                      clearable
                      append-icon="place"
        />
      </slot>
    </div>
    <div class="page-header__items">
      <slot name="title">
        <h1>{{ title }}</h1>
      </slot>
    </div>
    <div class="page-header__items page-header__controls">
      <slot name="controls"/>
    </div>
  </header>
</template>

<script>
import TheBreadcrumb from './TheBreadcrumb.vue';

export default {
  name: 'AppPageHeader',
  props: {
    title: {
      type: String,
      default: 'Page Title',
    },
    hasSearch: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    TheBreadcrumb,
  },
};
</script>

<style lang="scss" scoped>
  @import "../../scss/variables";
  @import "../../scss/mixin";

  .page-header {
    margin: 10px 0;
    align-items: center;
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: minmax(40px, auto) auto;
    grid-gap: 5px;
    justify-content: space-between;
  }

  .page-header__items {
    &:nth-child(even) {
      justify-self: end;
    }

    @include respond-to(mobile) {
      &:last-child {
        row-span: 2 / 3;
      }
    }
  }

  .page-header__search {
    display: grid;
    justify-items: end;
    align-items: center;
  }

</style>
