<template>
  <div>
    <h1>Result</h1>
    <div class="flowchart">
      <div v-for="(service, index) in services" :key="index" class="log-block" :style="{ backgroundColor: service.color }">
        {{ service.service }}
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'ResultPage',
  data() {
    return {
      logs: []
    }
  },
  async mounted() {
    this.result = await axios.get("http://127.0.0.1:8000/search-logs/");
    this.logs = this.result.data;
  },
  computed: {
    services() {
      const services = {};
      this.logs.forEach(log => {
        if (!services[log.service]) {
          services[log.service] = {
            service: log.service,
            color: ""
          };
        }
        if (log.level === "ERROR") {
          services[log.service].color = "red";
        } else if (log.level === "WARN") {
          services[log.service].color = "orange";
        } else if (log.level === "INFO") {
          services[log.service].color = "green";
        }
      });
      return Object.values(services);
    }
  }
};
</script>

<style>
.flowchart {
  /* styles for flowchart container */
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.log-block {
  /* styles for flowchart nodes */
  width: 100px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 5px;
  color: white;
  font-weight: bold;
  position: relative;
}

.log-block::after {
  /* styles for flowchart edges */
  content: "";
  position: absolute;
  top: 50%;
  left: 100%;
  transform: translateY(-50%);
  border: solid 2px #000;
  border-width: 2px 0 2px 2px;
  width: 20px;
}

.log-block:last-child::after {
  /* styles for last flowchart edge */
  display: none;
}

.red {
  background-color: red;
}

.orange {
  background-color: orange;
}

.green {
  background-color: green;
}
</style>
