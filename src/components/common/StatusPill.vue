<template v-slot:paymentStatus="slotProps">
  <div class="status" :class="slotProps.invoice.paymentStatus">
    {{ status }}
  </div>
</template>

<script>
export default {
  name: 'StatusPill',
  props: ['status'],
};
</script>

<style scoped>
  .status.paid {
    border-bottom: 2px solid var(--paidColor);
    color: var(--paidColor);
  }

  .status.due {
    border-bottom: 2px solid var(--dueColor);
    color: var(--dueColor);
  }

  .status.unpaid {
    border-bottom: 2px solid var(--unpaidColor);
    color: var(--unpaidColor);
  }

  .status.partial {
    border-bottom: 2px solid var(--partialColor);
    color: var(--partialColor);
  }

  .status.draft {
    border-bottom: 2px solid var(--draftColor);
    color: var(--draftColor);
  }
</style>
