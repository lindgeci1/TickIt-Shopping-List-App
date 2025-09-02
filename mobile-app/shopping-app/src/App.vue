<template>
  <ion-app>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>Market</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding">
        <ion-button expand="block" @click="loadMarket">
          Load Market Data
        </ion-button>

        <!-- Always-visible JSON box -->
        <div class="json-box">
          <pre>{{ JSON.stringify(marketItems, null, 2) }}</pre>
        </div>
      </ion-content>
    </ion-page>
  </ion-app>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import {
  IonApp,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
} from "@ionic/vue";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL as string;

interface MarketItem {
  id: number;
  name: string;
  price: number;
}

export default defineComponent({
  name: "App",
  components: {
    IonApp,
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
  },
  setup() {
    const marketItems = ref<MarketItem[]>([]);

    const loadMarket = async () => {
      try {
        const response = await axios.get<MarketItem[]>(`${API_URL}/market/all`);
        marketItems.value = response.data;
      } catch (err) {
        console.error("Failed to fetch market data:", err);
      }
    };

    return { loadMarket, marketItems };
  },
});
</script>

<style scoped>
.json-box {
  background-color: #e6f2ff; /* soft light blue */
  border-radius: 12px;
  padding: 16px;
  margin-top: 16px;
  font-family: monospace;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
