<template>
   <div class="nav-button"
        :class="{active : isActive}"
        @click="setActivePage">
     <img :src="require('../../assets/images/' + className)" alt="">
     <span>{{ btnName }}</span>
     <i class="fa fa-angle-right fa-lg"></i>
   </div>
</template>

<script>
export default {
  props: {
    btnName: {
      type: String,
      required: true,
      default: 'New Button',
    },
    className: {
      type: String,
    },
    navButtonIndex: {
      type: Number,
    },
    selectedPageIndex: {
      type: [Number, String],
    },
    isActive: {
      type: Boolean,
    },
    route: {
      type: String,
    },
  },
  data() {
    return {
    };
  },
  methods: {
    setActivePage() {
      this.$emit('navButtonClicked', {
        route: this.route,
        navButtonIndex: this.navButtonIndex,
        navButtonName: this.btnName,
      });
    },
  },
  created() {

  },
};
</script>

<style>
  div.nav-button{
    color: #9e9e9e;
    vertical-align: middle;
    margin-bottom: 2px;
    cursor: pointer;
    display: grid;
    padding:  5px;
    font-size: 15px;
    align-items: center;
    text-align: center;
    overflow: hidden;
    font-weight: 200;
    position: relative;
    -webkit-transition: all 500ms ease;
    -moz-transition: all 500ms ease;
    transition: all 500ms ease;
  }

  .nav-button::after{
    opacity: 0;
    border: 2px solid var(--base-color);
    border-radius: 5px;
    width: 0;
    content: "";
    height: 90%;
    display: inline-block;
    position: absolute;
    right: 0;
    -webkit-transition: opacity .4s ease-in-out;
    -moz-transition: opacity .4s ease-in-out;
    -o-transition: opacity .4s ease-in-out;
    transition: opacity .4s ease-in-out;
  }

  .nav-button:hover, .nav-button.active{
    --hover-bg-color : var(--base-color);
    color: var(--base-color);
    background-color: #7f27750d;
  }

  .nav-button:hover::after, .nav-button.active::after{
    opacity: 1;
    height: 48px;
    -webkit-transition: all 500ms ease;
    -moz-transition: all 500ms ease;
    transition: all 500ms ease;
  }

  .nav-button:hover img, .nav-button.active img{
    background-color: var(--base-color);
    border-radius: 50px;
  }

  .nav-button .fa:first-child{
    position: relative;
    font-size: 25px;
    padding:5px;
  }

  .nav-button img{
    justify-self: center;
    -webkit-transition: all 500ms ease;
    -moz-transition: all 500ms ease;
    transition: all 500ms ease;
  }

  .nav-button span{
    font-size: 13px;
    display: block;
    font-weight: 400;
  }

  .nav-button i:last-child{
    float: right;
    position: relative;
    top: 10px;
    display: none;
  }

  @media only screen and (min-width: 800px) {
    .nav-button svg:last-child{
       display: block;
    }

    .nav-button{
      align-items: left;
      grid-template-columns: 35px auto;
      text-align: left !important;
    }

    .nav-button:hover::after, .nav-button.active::after{
      opacity: 1;
      height: 90%;
    }

    .nav-button img{
      justify-self: left;
    }

    .hide-menu .nav-button{
      align-items: center;
      grid-template-columns: auto;
      text-align: center !important;
    }

     .hide-menu .nav-button img{
      justify-self: center !important;
    }
  }
</style>
