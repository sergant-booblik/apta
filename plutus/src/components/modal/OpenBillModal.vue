<template>
  <div v-if="bill">
    <div class="open-bill-modal__header">
      <div class="bill-info">
        <div class="bill-info__title">
          <h2>{{ bill.name }}</h2>
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
        class="card bill-card"
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
            v-for="(tab, index) in Tabs"
            role="button"
            :class="[
            'tab__item',
            { 'tab__item--active': tabItemActiveIndex === index }
          ]"
            @click="tabItemActiveIndex = index"
          >
            <component :is="calculateTabIcon(tab.name)" />
            {{ t(`Modal.OpenBill.Tab.${tab.name}.title`) }}
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
                      ? t(transaction.name)
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
              <Icon.ExternalLinkIcon />
            </router-link>
          </div>
          <div
            v-if="tabItemActiveIndex === 1"
            class="tab__body-item"
          >
            <div class="tab__body-item item--customize">
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
                    container=".modal__wrapper"
                    @update="(v) => changeCustomColor(v)"
                  />
                  <ColorPicker
                    v-model="bill.customFontColor"
                    :label="t('Modal.OpenBill.Tab.customize.Colors.font')"
                    container=".modal__wrapper"
                    @update="(v) => changeCustomFontColor(v)"
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="tabItemActiveIndex === 2"
            class="tab__body-item item--settings"
          >
            <InputComponent
              flex
              v-model="bill.name"
              :label="t('Modal.OpenBill.Tab.settings.Input.name.label')"
              class="mb-3"
            />
            <InputComponent
              flex
              v-model="bill.subtitle"
              :label="t('Modal.OpenBill.Tab.settings.Input.subtitle.label')"
              class="mb-3"
            />
            <InputComponent
              flex
              to-fixed
              :append-text="bill.currency.code"
              v-model="bill.amount"
              :label="t('Modal.OpenBill.Tab.settings.Input.initial.label')"
              class="mb-3"
            />
            <div
              v-show="!isShowConfirmationDelete && !isShowConfirmationClose"
              class="flex gap-4 justify-end"
            >
              <ButtonComponent
                class="self-end mt-4"
                :label="t('Modal.OpenBill.Tab.settings.Button.close.label')"
                :color="ColorType.PRIMARY"
                @click="toggleConfirmationClose"
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
              :icon="Icon.ExclamationCircleIcon"
              :text="t('Alert.DeleteBill.text')"
              :controls="[
                { label: t('Alert.DeleteBill.control.cancel'), onClick: toggleConfirmationDelete },
                { label: t('Alert.DeleteBill.control.delete'), onClick: deleteBill, color: ColorType.DANGER },
              ]"
            />
            <AlertComponent
              v-show="isShowConfirmationClose"
              :icon="Icon.ExclamationCircleIcon"
              :text="t('Alert.CloseBill.text')"
              :controls="[
                { label: t('Alert.CloseBill.control.cancel'), onClick: toggleConfirmationClose },
                { label: t('Alert.CloseBill.control.close'), onClick: closeBill, color: ColorType.DANGER },
              ]"
            />
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
import FormattedAmount from '@/components/elements/FormattedAmount.vue'
import { Sign } from '@/types/currency'
import { useI18n } from 'vue-i18n'
import Tabs from '../../../resources/static/bill-modal-tab.json'
import InputComponent from '@/components/InputComponent.vue'
import ButtonComponent from '@/components/ButtonComponent.vue'
import { ColorType } from '@/types/colors'
import AlertComponent from '@/components/AlertComponent.vue'
import { useProfileStore } from '@/store/profile'
import { formatTimeAgo } from '@vueuse/core'
import ColorPicker from '@/components/ColorPicker.vue'
import { useTransactionStore } from '@/store/transaction'

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

function calculateTransferIcon(type: 'income' | 'expense' | 'transferReceived' | 'transferSend') {
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

function calculateTabIcon(name: string) {
  switch (name) {
    case 'transactions':
      return Icon.ListIcon;
    case 'customize':
      return Icon.PaletteIcon;
    case 'settings':
      return Icon.GearIcon;
    default:
      throw new Error(name);
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
  updateBill('isClosed', true);
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
