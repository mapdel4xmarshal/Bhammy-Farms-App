<template>
  <div class="profile">
    <span>Hello, <strong>Bamidele Mapayi</strong></span>
    <div class="avatar animate">B</div>
    <font-awesome-icon icon="angle-down" class="toggle"></font-awesome-icon>
  </div>
</template>

<script>
export default {
  name: 'Profile',
};
</script>

<style scoped>
  .profile{
    padding-left: 10px;
    min-width: 50px;
  }

  .avatar{
    width: 30px;
    height: 30px;
    color: #EEEEEE;
    border-radius: 30px;
    line-height: 30px;
    background-color: var(--base-color);
    display: inline-block;
    cursor: pointer;
    position: relative;
  }

  .avatar:after{
    width: 13px;
    height: 13px;
    color: aquamarine;
    position: absolute;
    bottom: -2px;
    right: -3px;
    content: '';
    background-color: #00BCD4;
    border-radius: 15px;
  }

  .avatar:hover{
    transform: rotate(360deg);
    -webkit-box-shadow: inset 0 1px 0px 0px rgba(0,0,0,.075), 0 0 4px var(--glow-color);
    box-shadow: inset 0 1px 0px 0px rgba(0,0,0,.075), 0 0 3px var(--glow-color);
    -moz-box-shadow: inset 0 1px 0px 0px rgba(0,0,0,.075), 0 0 3px var(--glow-color);
  }

  .profile > span{
    display: none;
    font-size: 13px;
  }

  .toggle{
    cursor: pointer;
    padding-left: 5px;
  }

  @media only screen and (min-width: 800px) {
    .profile {
      padding: 0 10px;
    }

    .profile > span{
      display: inline-block;
    }
  }
</style>
