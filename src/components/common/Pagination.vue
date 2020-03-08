<template>
    <div class="pagination">
      <div class="pagination__records">
        <div>Records per page</div>
        <div>20</div>
      </div>
      <div class="pagination__controls">
        <div>1 - 20 of 200</div>
        <div>
          <div class="previous animate"><font-awesome-icon icon="angle-left"/> </div>
          <div class="next animate"><font-awesome-icon icon="angle-right"/> </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'Pagination',
};
</script>

<style scoped>
  div {
    display: inline-block;
  }

  .pagination{
    display: block;
    width: 100%;
    height: 40px;
  }

  .pagination__records{
    font-size: 12px;
  }

  .pagination__controls{
    float: right;
  }

  .pagination__controls > div:last-of-type{
    display: inline-grid;
    border: 1px solid #ccc;
    grid-template-columns: 35px 35px;
    margin-left: 10px;
    line-height: 35px;
    text-align: center;
    align-content: center;
    cursor: pointer;
    border-radius: 20px;
  }

  .pagination__controls > div:last-of-type div:hover{
    background-color: #CCCCCC;
  }

  .pagination__controls > div:last-of-type div.previous{
     border-radius: 20px 0 0 20px;
    border-right: 1px solid #CCCCCC;
  }

  .pagination__controls > div:last-of-type div.next{
    border-radius: 0 20px 20px 0;
  }
</style>
