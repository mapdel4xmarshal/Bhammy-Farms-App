<template>
    <div @click="clickHandler()" class="button-pill animate" :class="{'button-pill--style2' : !isPrimary}">
      <slot>{{ title }}</slot>
    </div>
</template>

<script>
export default {
  name: 'ButtonPill',
  props: {
    title: {
      type: String,
      default: 'Button',
    },
    clickHandler: {
      type: Function,
      default: () => {},
    },
    isPrimary: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style lang="scss" scoped>
  @import '../../scss/variables.scss';

 .button-pill {
   color: #FFFFFF;
   font-size: 13px;
   border-radius: 30px;
   background-color: $theme-color;
   cursor: pointer;
   display: inline;
   padding: 7px 10px;
   margin: 5px;
   white-space: nowrap;
   user-select: none;
   -moz-user-select: none;
   -webkit-user-select: none;

   &:hover{
     border-color: $theme-color;
     outline: 0;
     box-shadow: inset 0 1px 0px 0px rgba(0,0,0,.075), 0 0 3px var(--glow-color);
   }

   &--style2 {
     background-color: transparent;
     color: $theme-color;
     border: 1px solid $theme-color;
   }
 }

 div:hover{

 }
</style>
