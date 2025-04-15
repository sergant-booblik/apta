<template>
  <div class="add-expense-modal__body">
    <h2 class="mb-8 mt-2">
      {{ t('Modal.AddExpense.title') }}
    </h2>
    <InputComponent
      v-model="expense.name"
      flex
      :label="t('Modal.AddExpense.Name.label')"
      :placeholder="t('Modal.AddExpense.Name.placeholder')"
      :errors="errors.name"
      class="mb-3"
    />
    <SelectComponent
      v-model="expense.billId"
      flex
      :label="t('Modal.AddExpense.Bill.label')"
      :placeholder="t('Modal.AddExpense.Bill.placeholder')"
      :choices="billChoices"
      :errors="errors.bill"
      class="mb-3"
    />
    <InputComponent
      v-model="expense.createdDate"
      flex
      :type="InputType.DATETIME"
      :label="t('Modal.AddExpense.Date.label')"
      :placeholder="t('Modal.AddExpense.Date.placeholder')"
      :errors="errors.date"
    />
    <div class="full-line" />
    <div class="mb-3">
      <ToggleComponent
        v-model="isCalculateTotalByPrice"
        :label="t('Modal.AddExpense.Quantity.toggle')"
      />
    </div>
    <div
      class="flex gap-4"
      :class="{ 'flex-wrap': isCalculateTotalByPrice }"
    >
      <div class="flex gap-1 w-auto">
        <InputComponent
          v-model="expense.quantity"
          flex
          :type="InputType.NUMBER"
          :label="t('Modal.AddExpense.Quantity.label')"
          :placeholder="t('Modal.AddExpense.Quantity.placeholder')"
          :invalid="!!errors.quantity"
          class="mb-3"
          @change="calculateTotalAmountByPrice"
        />
        <SelectComponent
          v-model="expense.unitId"
          flex
          :placeholder="t('Modal.AddExpense.Unit.placeholder')"
          :choices="unitChoices"
          :errors="errors.quantity"
        />
      </div>
      <div
        v-if="isCalculateTotalByPrice"
        class="flex gap-1 w-auto"
      >
        <InputComponent
          v-model="price"
          flex
          :type="InputType.NUMBER"
          :append-text="currency"
          :label="t('Modal.AddExpense.Price.label')"
          :placeholder="t('Modal.AddExpense.Price.placeholder')"
          class="mb-3"
          @change="calculateTotalAmountByPrice"
        />
      </div>
      <div
        v-if="!isCalculateTotalByPrice"
        class="w-auto"
      >
        <InputComponent
          v-model="expense.amount"
          flex
          :type="InputType.NUMBER"
          :append-text="currency"
          :label="t('Modal.AddExpense.Amount.label')"
          :placeholder="t('Modal.AddExpense.Amount.placeholder')"
          :errors="errors.amount"
          class="mb-3"
        />
      </div>
    </div>
    <div
      v-if="isCalculateTotalByPrice"
      class="mb-3 flex gap-4"
    >
      <InputComponent
        v-model="expense.amount"
        flex
        disabled
        :type="InputType.NUMBER"
        :append-text="currency"
        :label="t('Modal.AddExpense.Amount.label')"
        :placeholder="t('Modal.AddExpense.Amount.placeholder')"
        class="mb-3"
      />
    </div>
    <div class="full-line" />
    <div class="flex gap-4 mb-3">
      <div class="w-full flex flex-col items-end">
        <SelectComponent
          v-model="expense.categoryId"
          flex
          :label="t('Modal.AddExpense.Category.label')"
          :placeholder="t('Modal.AddExpense.Category.placeholder')"
          :choices="categoryChoices"
          @change="updateSubcategories"
        />
        <div
          v-if="isShowAddCategory"
          class="flex items-center gap-2 mt-2 w-full"
        >
          <EmojiPickerComponent
            v-model="category.emoji"
          />
          <InputComponent
            v-model="category.name"
            flex
          />
          <ButtonComponent
            :color="ColorType.SECONDARY"
            :append-icon="BIconCheck"
            @click="addNewCategory"
          />
          <ButtonComponent
            :color="ColorType.SECONDARY"
            :append-icon="BIconX"
            @click="toggleAddCategory()"
          />
        </div>
        <a
          v-if="!isShowAddCategory"
          role="button"
          class="text-sm mt-1"
          @click="toggleAddCategory"
        >
          {{ t('Modal.AddExpense.Category.button') }}
        </a>
      </div>
      <div class="w-full flex flex-col items-end">
        <SelectComponent
          v-model="expense.subcategoryId"
          flex
          :disabled="!expense.categoryId"
          :label="t('Modal.AddExpense.Subcategory.label')"
          :placeholder="t('Modal.AddExpense.Subcategory.placeholder')"
          :choices="subcategoryChoices"
        />
        <div
          v-if="isShowAddSubcategory"
          class="flex items-center gap-2 mt-2 w-full"
        >
          <EmojiPickerComponent
            v-model="subcategory.emoji"
          />
          <InputComponent
            v-model="subcategory.name"
            flex
          />
          <ButtonComponent
            :color="ColorType.SECONDARY"
            :append-icon="BIconCheck"
            @click="addNewSubcategory"
          />
          <ButtonComponent
            :color="ColorType.SECONDARY"
            :append-icon="BIconX"
            @click="toggleAddSubcategory()"
          />
        </div>
        <a
          v-if="!isShowAddSubcategory && expense.categoryId"
          role="button"
          class="text-sm mt-1"
          @click="toggleAddSubcategory"
        >
          {{ t('Modal.AddExpense.Subcategory.button') }}
        </a>
      </div>
    </div>
    <div class="flex gap-4 justify-end mt-6">
      <ButtonComponent
        :color="ColorType.PRIMARY"
        :label="t('Modal.AddExpense.AddMore.button')"
        @click="addExpense('more')"
      />
      <ButtonComponent
        :color="ColorType.SECONDARY"
        :label="t('Modal.AddExpense.AddFinish.button')"
        @click="addExpense('finish')"
      />
      <ButtonComponent
        :color="ColorType.SECONDARY"
        :label="t('Modal.AddExpense.Cancel.button')"
        @click="modalStore.removeModal()"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import InputComponent from '@/components/InputComponent.vue'
import type { Expense } from '@/types/expense'
import { InputType } from '@/types/controllers'
import { useProfileStore } from '@/store/profile'
import { storeToRefs } from 'pinia'
import { useCategoryStore } from '@/store/category'
import { useBillStore } from '@/store/bill'
import ButtonComponent from '@/components/ButtonComponent.vue'
import { useExpenseStore } from '@/store/expense'
import SelectComponent from '@/components/SelectComponent.vue'
import type { Choice } from '@/types/choice'
import { useI18n } from 'vue-i18n'
import ToggleComponent from '@/components/ToggleComponent.vue'
import { ColorType } from '@/types/colors'
import type { Category, Subcategory } from '@/types/category'
import EmojiPickerComponent from '@/components/EmojiPickerComponent.vue'
import { useModalStore } from '@/store/modal'
import { formatDateForInput } from '@/helpers/format-date'
import type { AddExpenseResponse } from '@/api/add-expense'
import type { ErrorDetail } from '@/types/error'
import { BIconCheck, BIconX } from 'bootstrap-icons-vue'

function updateSubcategories(): void {
  if (expense.value.categoryId) {
    categoryStore.fetchSubcategories(expense.value.categoryId);
  }
}

function calculateTotalAmountByPrice(): void {
  if (isCalculateTotalByPrice.value) {
    expense.value.amount = price.value * expense.value.quantity;
  }
}

function toggleAddCategory(): void {
  isShowAddCategory.value = !isShowAddCategory.value;
}

function toggleAddSubcategory(): void {
  isShowAddSubcategory.value = !isShowAddSubcategory.value;
}

function addNewCategory(): void {
  categoryStore.addCategory(category.value).then((result: Category) => {
    expense.value.categoryId = result.id;
    isShowAddCategory.value = false;
  });
}

function addNewSubcategory(): void {
  categoryStore.addSubcategory({ ...subcategory.value, categoryId: expense.value.categoryId }).then((result: Subcategory) => {
    expense.value.subcategoryId = result.id;
    isShowAddSubcategory.value = false;
  });
}

function addExpense(type: 'more' | 'finish'): void {
  expenseStore.addExpense(expense.value).then((result: AddExpenseResponse) => {
    if (result.expense) {
      expense.value = structuredClone({ ...defaultExpense, billId: expense.value.billId, createdDate: expense.value.createdDate });
      if (type === 'finish') {
        modalStore.removeModal();
      }
    }
  });
}

const profileStore = useProfileStore();
const categoryStore = useCategoryStore();
const billStore = useBillStore();
const expenseStore = useExpenseStore();
const modalStore = useModalStore();

const { t } = useI18n();

const { profile } = storeToRefs(profileStore);
const { categories, subcategories, units } = storeToRefs(categoryStore);
const { bills } = storeToRefs(billStore);
const { errors } = storeToRefs(expenseStore);

const currency = computed(() => billStore.getCertainBill(expense.value.billId)?.currency.code ?? '-');

const isCalculateTotalByPrice = ref(false);
const isShowAddCategory = ref(false);
const isShowAddSubcategory = ref(false);
const price = ref(0);

const categoryChoices = computed(() => categories.value.map((category) => ({
  key: category.id,
  value: `${category.emoji} ${category.name}`,
})) as Choice[]);

const subcategoryChoices = computed(() => subcategories.value.map((subcategory) => ({
  key: subcategory.id,
  value: `${subcategory.emoji} ${subcategory.name}`,
})) as Choice[]);

const billChoices = computed(() => bills.value.map((bill) => ({
  key: bill.id,
  value: `${bill.name} (${bill.currency.code})`,
})) as Choice[]);

const unitChoices = computed(() => units.value.map((unit) => ({
  key: unit.id,
  value: unit.name,
})) as Choice[]);

const defaultExpense = {
  name: '',
  amount: 0,
  createdDate: formatDateForInput(new Date()),
  userId: profile.value?.id,
  categoryId: undefined,
  subcategoryId: undefined,
  billId: undefined,
  quantity: 0,
  unitId: undefined,
};

const expense = ref<Expense>(structuredClone(defaultExpense));

const category = ref<Partial<Category>>({
  name: t('Modal.AddExpense.Category.new'),
  emoji: '🛍️',
  type: 'expense',
});

const subcategory = ref<Partial<Subcategory>>({
  name: t('Modal.AddExpense.Subcategory.new'),
  emoji: '🛍️',
});

onMounted(() => {
  categoryStore.fetchCategories('expense');
  categoryStore.fetchUnits();
  billStore.fetchBills();
});
</script>

<style scoped lang="scss">
.full-line {
  @apply mt-6 mb-4;
  @apply border-b border-b-slate-400 dark:border-b-slate-700;
}
</style>