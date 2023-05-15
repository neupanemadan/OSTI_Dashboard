<template>
  <div>
    <n-form ref="searchFormRef" inline size="large">
      <n-grid :span="24" :x-gap="24">
        <n-form-item-gi :span="3" path="age" label="書類" label-align="left">
          <n-select
            filterable
            placeholder="書類"
            :options="documentCategories"
            v-model:value="filters.document_category_id"
            size="large"
          />
        </n-form-item-gi>
        <n-form-item-gi :span="6" path="customer_id" label="取引先名" label-align="left">
          <n-select
            filterable
            placeholder="取引先名"
            :options="customers"
            v-model:value="filters.customer_id"
            size="large"
          />
        </n-form-item-gi>
        <n-form-item-gi :span="8" path="date" label="取引日" label-align="left">
          <n-input-group>
            <n-date-picker
              pair
              separator="-"
              size="large"
              type="date"
              value-format="yyyy-MM-dd"
              v-model:formatted-value="filters.torihiki_datetime.from"
              autosize
            />
            <n-input-group-label size="large">～</n-input-group-label>
            <n-date-picker
              size="large"
              type="date"
              value-format="yyyy-MM-dd"
              v-model:formatted-value="filters.torihiki_datetime.to"
              autosize
            />
          </n-input-group>
        </n-form-item-gi>
        <n-form-item-gi :span="7" path="customer_id" label="金額" label-align="left">
          <n-input
            pair
            separator="～"
            @update:value="handleAmountUpdate"
            placeholder="金額"
            size="large"
          ></n-input>
        </n-form-item-gi>
      </n-grid>
    </n-form>
    <n-space>
      <n-button @click="onFilter" attr-type="submit" type="primary" size="large">検索</n-button>
      <n-button @click="onReset" type="warning" size="large">リセット</n-button>
    </n-space>
  </div>
</template>
<script>
export default {
  data() {
    return {
      baseFilters: {
        document_category_id: null,
        customer_id: null,
        torihiki_datetime: {
          from: null,
          to: null
        },
        torihiki_kingaku: {
          from: null,
          to: null
        }
      },
      filters: {}
    };
  },
  created() {
    this.filters = JSON.parse(JSON.stringify(this.baseFilters));
  },
  methods: {
    handleAmountUpdate(amounts) {
      this.filters.torihiki_kingaku.from = parseInt(amounts[0]);
      this.filters.torihiki_kingaku.to = parseInt(amounts[1]);
    },
    onReset() {
      this.filters = JSON.parse(JSON.stringify(this.baseFilters));
      this.$emit("update:filter", this.filters);
    },
    onFilter() {
      const filters = Object.fromEntries(
        Object.entries(this.filters).filter(([_, filter]) => {
          if (filter && typeof filter === "object") {
            return filter.from !== null || filter.to !== null;
          }

          return filter !== null;
        })
      );

      this.$emit("update:filter", filters);
    }
  },
  props: {
    customers: {
      type: Array
    },
    documentCategories: {
      type: Array
    }
  }
};
</script>