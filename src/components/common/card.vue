<template>
    <div class="card">
      <slot></slot>
    </div>
</template>

<script>
export default {
  name: 'card',
};
</script>

<style scoped>
  .card {
    background-color: #FFF;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    box-shadow: 0px 0px 4px -3px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 0px 0px 4px -3px rgba(0, 0, 0, 0.75);
    -webkit-box-shadow: 0px 0px 4px -3px rgba(0, 0, 0, 0.75);
    -o-box-shadow: 0px 0px 4px -3px rgba(0, 0, 0, 0.75);
    padding: 10px 0;
    margin-bottom: 20px;
  }
</style>
