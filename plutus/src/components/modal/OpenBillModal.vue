<template>
  <div v-if="bill">
    <div class="open-bill-modal__header">
      <div class="bill-info">
        <div class="bill-info__title">
          <h2 class="flex gap-2 items-center">
            <BIconEyeSlash
              v-if="bill.isClosed"
            />
            {{ bill.name }}
          </h2>
          <p>{{ bill.subtitle }}</p>
        </div>
        <div class="bill-info__balances">
          <div class="bill-info-balance">
            <span>{{ t('Modal.OpenBill.Amount.initial') }}</span>
            <FormattedAmount
              :sum="bill.amount"
              :currency-code="bill.currency.code"
              :sign="Sign.NEUTRAL"
            />
          </div>
          <div class="bill-info-balance">
            <span>{{ t('Modal.OpenBill.Amount.incomes') }}</span>
            <FormattedAmount
              :sum="bill.incomeSum"
              :currency-code="bill.currency.code"
              :sign="Sign.POSITIVE"
            />
          </div>
          <div class="bill-info-balance">
            <span>{{ t('Modal.OpenBill.Amount.expenses') }}</span>
            <FormattedAmount
              :sum="bill.outcomeSum"
              :currency-code="bill.currency.code"
              :sign="Sign.NEGATIVE"
            />
          </div>
        </div>
      </div>
      <CardComponent
        :class="[
          'bill-card',
          { 'bill-card--hidden': bill.isClosed }
        ]"
        :style="{
          backgroundColor: bill.customColor,
          color: bill.customFontColor,
         }"
      >
        <div class="bill-card__top">
          <div>
            <p>{{ bill.name }}</p>
            <p class="text-sm mb-3 opacity-60">{{ bill.subtitle }}</p>
          </div>
          <div
            v-if="bill.customIcon"
            class="bill-card__icon"
          >
            <img
              :src="bill.customIcon"
              alt="icon"
            >
          </div>
          <component
            v-else
            :is="`${bill.icon}-icon`"
          />
        </div>
        <h2>{{ toMoney(bill.currentAmount, bill.currency.code) }}</h2>
        <FormattedAmount
          :currency-code="bill.currency.code"
          :sum="bill.transSum"
          :background-color="bill.customColor"
          class="mt-auto"
        />
      </CardComponent>
    </div>
    <div class="open-bill-modal__body">
      <nav class="tab">
        <div class="tab__header">
          <div
            role="button"
            :class="[
              'tab__item',
              { 'tab__item--active': tabItemActiveIndex === 0 }
            ]"
            @click="tabItemActiveIndex = 0"
          >
            <BIconListNested />
            {{ t(`Modal.OpenBill.Tab.transactions.title`) }}
          </div>
          <div
            v-if="!bill.isClosed"
            role="button"
            :class="[
              'tab__item',
              { 'tab__item--active': tabItemActiveIndex === 1 }
            ]"
            @click="tabItemActiveIndex = 1"
          >
            <BIconPalette />
            {{ t(`Modal.OpenBill.Tab.customize.title`) }}
          </div>
          <div
            role="button"
            :class="[
              'tab__item',
              { 'tab__item--active': tabItemActiveIndex === 2 }
            ]"
            @click="tabItemActiveIndex = 2"
          >
            <BIconGear />
            {{ t(`Modal.OpenBill.Tab.settings.title`) }}
          </div>
        </div>
        <div class="tab__body">
          <div
            v-if="tabItemActiveIndex === 0"
            class="tab__body-item"
          >
            <table
              v-if="transactions.length > 0"
              class="tab__transfers"
            >
              <tr
                v-for="(transaction, index) in transactions"
                :key="index"
                class="transfer__item"
              >
                <td class="transfer__icon">
                  <component :is="calculateTransferIcon(transaction.type)" />
                </td>
                <td class="transfer__amount">
                  <FormattedAmount
                    :sum="transaction.amount"
                    :currency-code="bill.currency.code"
                    :sign="Sign.NONE"
                  />
                </td>
                <td class="transfer__category">
                  {{
                    transaction.type === 'transferReceived' || transaction.type === 'transferSend'
                      ? t(transaction.category)
                      : transaction.category
                  }}
                </td>
                <td class="transfer__subcategory">
                  {{
                    transaction.type === 'transferReceived' || transaction.type === 'transferSend'
                      ? t(transaction.subcategory)
                      : transaction.subcategory
                  }}
                </td>
                <td class="transfer__name">
                  {{
                    transaction.type === 'transferReceived' || transaction.type === 'transferSend'
                      ? t(transaction.name, { bill: bill.name })
                      : transaction.name
                  }}
                </td>
                <td :title="toDate(transaction.date)" class="transfer__date">
                  {{ formatTimeAgo(new Date(transaction.date)) }}
                </td>
              </tr>
            </table>
            <div
              v-else
              class="tab__transfers--empty"
            >
              <h4>{{ t('Modal.OpenBill.Tab.transactions.Empty.title') }}</h4>
              <p>
                {{ t('Modal.OpenBill.Tab.transactions.Empty.text') }}
              </p>
            </div>
            <router-link
              to="#"
              class="mt-4 font-extralight float-end text-sm flex gap-2 items-center hover:opacity-80"
            >
              {{ t('Transfer.History.Footer.link') }}
              <BIconBoxArrowUpRight />
            </router-link>
          </div>
          <div
            v-if="tabItemActiveIndex === 1"
            class="tab__body-item"
          >
            <div class="tab__customize">
              <div class="customize__icon">
                <h3 class="mb-2">{{ t('Modal.OpenBill.Tab.customize.Icon.title') }}</h3>
                <div class="image-upload">
                  <input
                    ref="inputRef"
                    type="file"
                    accept="image/*"
                    @change="uploadFile"
                  />
                  <div class="preview-container">
                    <img
                      v-if="bill.customIcon"
                      :src="bill.customIcon"
                      alt="Image preview"
                      class="preview"
                    />
                  </div>
                  <ButtonComponent
                    :label="bill.customIcon ? t('Modal.OpenBill.Tab.customize.Icon.Uploader.change') : t('Modal.OpenBill.Tab.customize.Icon.Uploader.upload')"
                    :color="ColorType.SECONDARY"
                    @click="triggerFileInput"
                  />
                </div>
              </div>
              <div class="customize__colors">
                <h3 class="mb-2">{{ t('Modal.OpenBill.Tab.customize.Colors.title') }}</h3>
                <div class="flex gap-4">
                  <ColorPicker
                    v-model="bill.customColor"
                    :label="t('Modal.OpenBill.Tab.customize.Colors.background')"
                    :default-color="defaultBgColor"
                    container=".modal__wrapper"
                    @update="(v) => changeCustomColor(v)"
                  />
                  <ColorPicker
                    v-model="bill.customFontColor"
                    :label="t('Modal.OpenBill.Tab.customize.Colors.font')"
                    :default-color="defaultFontColor"
                    container=".modal__wrapper"
                    @update="(v) => changeCustomFontColor(v)"
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="tabItemActiveIndex === 2"
            class="tab__body-item tab__settings"
          >
            <div class="tab__settings">
              <InputComponent
                v-model="bill.name"
                flex
                :disabled="bill.isClosed"
                :label="t('Modal.OpenBill.Tab.settings.Input.name.label')"
                class="mb-3"
              />
              <InputComponent
                v-model="bill.subtitle"
                flex
                :disabled="bill.isClosed"
                :label="t('Modal.OpenBill.Tab.settings.Input.subtitle.label')"
                class="mb-3"
              />
              <InputComponent
                v-model="bill.amount"
                flex
                to-fixed
                :disabled="bill.isClosed"
                :append-text="bill.currency.code"
                :label="t('Modal.OpenBill.Tab.settings.Input.initial.label')"
                class="mb-3"
              />
              <div
                v-show="!isShowConfirmationDelete && !isShowConfirmationClose"
                class="flex gap-4 justify-end"
              >
                <ButtonComponent
                  v-if="!bill.isClosed"
                  class="self-end mt-4"
                  :label="t('Modal.OpenBill.Tab.settings.Button.close.label')"
                  :color="ColorType.PRIMARY"
                  @click="toggleConfirmationClose"
                />
                <ButtonComponent
                  v-else
                  class="self-end mt-4"
                  :label="t('Modal.OpenBill.Tab.settings.Button.open.label')"
                  :color="ColorType.PRIMARY"
                  @click="openBill"
                />
                <ButtonComponent
                  class="self-end mt-4"
                  :label="t('Modal.OpenBill.Tab.settings.Button.delete.label')"
                  :color="ColorType.DANGER"
                  @click="toggleConfirmationDelete"
                />
              </div>
              <AlertComponent
                v-show="isShowConfirmationDelete"
                :icon="BIconExclamationCircle"
                :text="t('Alert.DeleteBill.text')"
                :controls="[
                { label: t('Alert.DeleteBill.control.cancel'), onClick: toggleConfirmationDelete },
                { label: t('Alert.DeleteBill.control.delete'), onClick: deleteBill, color: ColorType.DANGER },
              ]"
              />
              <AlertComponent
                v-show="isShowConfirmationClose"
                :icon="BIconExclamationCircle"
                :text="t('Alert.CloseBill.text')"
                :controls="[
                { label: t('Alert.CloseBill.control.cancel'), onClick: toggleConfirmationClose },
                { label: t('Alert.CloseBill.control.close'), onClick: closeBill, color: ColorType.DANGER },
              ]"
              />
            </div>
          </div>
        </div>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, type Ref, ref } from 'vue'
import { useBillStore } from '@/store/bill'
import { useModalStore } from '@/store/modal'
import { storeToRefs } from 'pinia'
import type { Bill } from '@/types/bill'
import { toMoney } from '@/helpers/to-money'
import CardComponent from '@/components/CardComponent.vue'
import Icon from '@/components/icons'
import { BIconExclamationCircle, BIconEyeSlash, BIconBoxArrowUpRight, BIconGear, BIconListNested, BIconPalette } from 'bootstrap-icons-vue'
import FormattedAmount from '@/components/elements/FormattedAmount.vue'
import { Sign } from '@/types/currency'
import { useI18n } from 'vue-i18n'
import InputComponent from '@/components/InputComponent.vue'
import ButtonComponent from '@/components/ButtonComponent.vue'
import { ColorType, DEFAULT_BG_COLOR, DEFAULT_FONT_COLOR } from '@/types/colors'
import AlertComponent from '@/components/AlertComponent.vue'
import { useProfileStore } from '@/store/profile'
import { formatTimeAgo } from '@vueuse/core'
import ColorPicker from '@/components/ColorPicker.vue'
import { useTransactionStore } from '@/store/transaction'
import type { CategoryType, SubcategoryType } from '@/types/category'

function useUploadFile(
  bill: Ref<Bill | undefined>,
  inputRef: Ref<HTMLInputElement | undefined>,
): () => void {
  const billStore = useBillStore();
  function uploadFile(): void {
    billStore.uploadBillIcon(bill.value, inputRef.value?.files);
  }

  return uploadFile;
}

function updateBill(field: keyof Bill, value: unknown): void {
  billStore.updateBill({ id: bill.value?.id, [field]: value });
}

function changeCustomColor(color: string) {
  if (bill.value) {
    bill.value.customColor = color;
    updateBill('customColor', color);
  }
}

function changeCustomFontColor(color: string) {
  if (bill.value) {
    bill.value.customFontColor = color;
    updateBill('customFontColor', color);
  }
}

function triggerFileInput() {
  inputRef.value?.click();
}

function calculateTransferIcon(type: CategoryType | SubcategoryType) {
  switch (type) {
    case 'income':
      return Icon.TransferIncomeIcon;
    case 'expense':
      return Icon.TransferOutcomeIcon;
    case 'transferSend':
      return Icon.TransferTransactionSentIcon;
    case 'transferReceived':
      return Icon.TransferTransactionReceivedIcon;
    default:
      throw new Error(`Unrecognized icon ${type}`);
  }
}

function toggleConfirmationDelete(): void {
  isShowConfirmationDelete.value = !isShowConfirmationDelete.value;
}

function toggleConfirmationClose(): void {
  isShowConfirmationClose.value = !isShowConfirmationClose.value;
}

function deleteBill(): void {
  if (bill.value) billStore.deleteBill(bill.value);
}

function closeBill(): void {
  if (bill.value) {
    updateBill('isClosed', true);
    isShowConfirmationClose.value = false;
    bill.value.isClosed = true;
  }
}

function openBill(): void {
  if (bill.value) {
    updateBill('isClosed', false);
    bill.value.isClosed = false;
  }
}

function toDate(string: Date) {
  const date = new Date(string);
  return date.toLocaleDateString(profile.value?.locale);
}

const { t } = useI18n();

const modalStore = useModalStore();
const billStore = useBillStore();
const profileStore = useProfileStore();
const transactionStore = useTransactionStore();

const theme = localStorage.getItem('theme') ?? 'light';
const defaultBgColor = theme === 'light' ? DEFAULT_BG_COLOR.LIGHT : DEFAULT_BG_COLOR.DARK;
const defaultFontColor = theme === 'light' ? DEFAULT_FONT_COLOR.LIGHT : DEFAULT_FONT_COLOR.DARK;

const inputRef = ref<HTMLInputElement>();

const isShowConfirmationDelete = ref(false);
const isShowConfirmationClose = ref(false);

const { id } = storeToRefs(modalStore);
const { profile } = storeToRefs(profileStore);
const { transactions } = storeToRefs(transactionStore);

const tabItemActiveIndex = ref(0);

const bill = computed(() => billStore.getCertainBill(id.value));

const uploadFile = useUploadFile(bill, inputRef);

onMounted(() => {
  if (bill.value) {
    transactionStore.fetchTransaction(bill.value.id, 10);
  }
})
</script>

<style scoped lang="scss">
.tab {
  @apply relative;

  .tab__header {
    @apply flex justify-between gap-6;
    @apply border-b border-slate-300 dark:border-slate-500;

    .tab__item {
      @apply flex items-center gap-2;
      @apply pb-4 pe-2;
      @apply text-slate-500;
      @apply border-b border-slate-950/0 dark:border-slate-50/0;
      @apply transition-all;

      &:hover {
        @apply text-slate-950 dark:text-slate-50;
      }

      &--active {
        @apply text-slate-950 dark:text-slate-50;
        @apply border-slate-950 dark:border-slate-50;
      }

      svg {
        @apply w-4 h-4;
      }
    }
  }

  .tab__body {
    @apply overflow-hidden;
    @apply flex;
    @apply w-full;

    .tab__body-item {
      @apply grow-0 shrink-0 basis-full;
      @apply h-full w-min;
      @apply mt-4;
      @apply transition-all;
    }
  }

  .tab__transfers {
    @apply w-full;

    &--empty {
      @apply flex flex-col items-center;
      @apply w-full h-full;
      @apply text-center;
    }

    .transfer__item {
      @apply w-full h-full;

      td {
        @apply pb-2;
        @apply whitespace-nowrap;

        &:not(:last-child) {
          @apply pe-6;
        }
      }

      .transfer__amount,
      .transfer__date {
        @apply float-end;
      }

      .transfer__name {
        @apply font-light;
        @apply italic;
      }

      .transfer__date {
        @apply float-end;
      }
    }
  }

  .tab__customize {
    @apply flex gap-14;
    @apply w-fit;

    .image-upload {
      @apply flex items-center gap-2;

      input {
        @apply hidden;
        @apply w-0 h-0;
      }

      .preview-container {
        @apply aspect-square;
        @apply w-10 h-10;

        &--empty {
          @apply bg-slate-400 dark:bg-slate-600;
        }

        img {
          @apply flex justify-center items-center;
          @apply object-contain;
          @apply w-10 h-10;
        }
      }

      .button-group {
        @apply grow shrink-0;
      }
    }
  }

  .tab__settings {
    @apply flex flex-col;
  }
}

.open-bill-modal__header {
  @apply flex gap-8 justify-between;

  .bill-info {
    @apply grow shrink-0;

    .bill-info__title {
      @apply flex flex-col gap-2;

      p {
        @apply text-slate-600 dark:text-slate-400;
      }

      svg {
        @apply h-5 w-5;
      }
    }

    .bill-info__balances {
      @apply mt-6;
    }

    .bill-info-balance {
      @apply flex gap-3;

      span {
        @apply basis-1/2;
      }
    }
  }

  .bill-card {
    @apply flex flex-col grow shrink;
    @apply w-full;
    @apply min-w-72 max-w-80;
    @apply py-4;
    @apply aspect-unset;
    @apply cursor-default;

    &:hover {
      @apply translate-y-0;
      @apply bg-transparent;
    }

    .bill-card__top {
      @apply flex justify-between gap-8;

      .bill-card__icon {
        @apply flex justify-end items-center;
        @apply w-10 h-10;

        img {
          @apply rounded-md;
        }
      }

      .hidden-icon {
        @apply w-3 h-3;
      }
    }
  }
}

.open-bill-modal__body {
  @apply mt-8;
}
</style>
