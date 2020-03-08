<template>
  <div>
    <div class="scrollable">
      <div class="table__header">
        <div v-for="(header, index) in headers"
             class="table__column"
             :key="header.id"
             :class="header.breakPoint"
             :style="columnStyles[index]"
             :title="header.label">
          {{header.label}}
        </div>
        <div v-if="expandable" class="table__column--expandable"></div>
      </div>

      <div class="table__row"
           v-for="record in records"
           :key="record.id"
           @click="clickHandler(record)"
           :class="{'dropdown--active' : record.id == activeDropdown}">
        <div class="table__column"
             v-for="(header, index) in headers"
             :key="'key-' + header.id"
             :class="header.breakPoint"
             :style="columnStyles[index]"
             :title="header.representedAs? header.representedAs(record) : record[header.id]">
          <slot :name="header.slot" v-bind:record="record">
            {{header.representedAs? header.representedAs(record) : record[header.id]}}
          </slot>
        </div>

        <div v-if="expandable" class="table__column--expandable">
          <div class="dropdown__toggle" @click="toggleDropdown(record)">
            <font-awesome-icon icon="angle-down" focusable="true" class="toggle"/>
          </div>
        </div>

        <transition name="slide-fade">
          <div v-if="record.id == activeDropdown" class="table__column dropdown">
            <div class="dropdown--animate">
              <slot name="dropdown" v-bind:record="record" :headers="headers"></slot>
            </div>
          </div>
        </transition>
      </div>
    </div>
    <pagination v-if="usePagination"></pagination>
  </div>
</template>

<script>
import Pagination from './Pagination';

export default {
  name: 'customTable',
  data() {
    return {
      activeDropdown: -1,
      columnStyles: this.populateWidths(),
    };
  },
  props: {
    title: {
      type: String,
      required: false,
    },
    usePagination: {
      type: Boolean,
      required: false,
      default: false,
    },
    records: {
      type: Array,
    },
    headers: {
      type: Array,
    },
    expandable: {
      type: Boolean,
      required: false,
      default: false,
    },
    clickHandler: {
      type: Function,
      required: false,
      default: () => {},
    },
  },
  components: {
    Pagination,
  },
  methods: {
    toggleDropdown(record) {
      record.showDropdown = !record.showDropdown;
      this.activeDropdown = record.id === this.activeDropdown ? -1 : record.id;
      console.log(record, this.columnStyles);
    },
    populateWidths() {
      return this.headers.map(
        (header) => (header.width ? { flex: `0 0 ${header.width}` } : {}),
      );
    },
  },
  computed: {},
  created() {
    console.log(this.records);
  },
};
</script>

<style lang="scss" scoped>
  @import "../../scss/global";

  .dropdown {
    border: none !important;
    flex: 1 100% !important;
    height: auto !important;
    padding: 10px !important;
  }

  .dropdown--active {
    border: 1px solid #CCC !important;
    border-radius: 5px;

    & .toggle {
      transform: rotate(-180deg);
    }
  }

  .dropdown--active:hover {
    border: 1px solid transparent !important;
    box-shadow: 0px 0px 2px 1.5px rgba(0, 0, 0, 0.2);
    background-color: #FFFFFF !important;
    -moz-box-shadow: 0px 0px 2px 2px rgba(0, 0, 0, 0.2);
    -webkit-box-shadow: 0px 0px 2px 1.5px rgba(0, 0, 0, 0.2);
    -o-box-shadow: 0px 0px 2px 2px rgba(0, 0, 0, 0.2);
  }

  .dropdown--active + .table__row {
    border-top: none !important;
  }

  .dropdown__toggle {
    @extend .animate;
    border: 1px solid #CCC;
    border-radius: 10px;
    cursor: pointer;
    padding: 5px;
    text-align: center;
  }

  .dropdown__toggle:hover {
    background-color: #CCC;
  }

  .table__header {
    border-top: none !important;
  }

  .table__row, .table__header {
    border-top: 1px solid #e0e0e0;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    overflow: hidden;
    width: 100%;
    justify-content: space-between;

    .table__column:first-child{
      margin-left: 5px;
    }
  }

  .table__row:hover {
    background-color: #F5F5F5;
    cursor: pointer;
  }

  .table__column {
    transition: height .5s 1s ease-in-out;
    display: flex;
    flex-direction: column;
    flex-basis: 100%;
    flex: 1;
    font-size: 14px;
    height: 40px;
    justify-content: center;
    overflow: hidden;
    padding: 5px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .table__column--expandable {
    @extend .table__column;
    flex-basis: 50px;
    flex-grow: 0;
    flex-shrink: 0;
  }

  .toggle {
    transition: transform 0.35s ease-in;
  }

  .slide-fade-enter-active {
    transition: max-height .35s ease, opacity 0.35s .35s ease-in, transform 0.35s .35s ease-in;
    max-height: 500px;
  }

  .slide-fade-leave-active {
    transition: max-height .35s .15s ease, opacity 0.35s ease-in, transform 0.35s ease-in;
  }

  .slide-fade-enter, .slide-fade-leave-to {
    max-height: 0px;
    transform: translateY(-10px);
    opacity: 0;
  }

  .slide-fade-leave {
    max-height: 500px;
  }

  .small, .medium, .large{
    display: none;
  }

  @include respond-to(mobile) {
    .small {
      display: inherit;
    }
  }

  @include respond-to(tablet) {
    .medium {
      display: inherit;
    }
  }

  @include respond-to(desktop) {
    .large {
      display: inherit;
    }
  }
</style>
