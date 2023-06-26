<template>
  <form @submit.prevent="handleSubmit">
    <label>Correlation ID:</label>
    <input type="text" required v-model="id">

    <div class="submit">
      <button type="submit" class="yes" v-on:click="submit()">Submit</button>
    </div>
  </form>
  <div v-if="showResult" class="result">
      <h1>Result</h1>
      <div class="flowchart">
        <div v-for="(service, index) in services" :key="index" class="log-block" :style="{ backgroundColor: service.color }" @click="showLogs(service.service), showBox = !showBox">
          <h4>{{ service.service }}</h4>
        </div>
      </div>
  </div>
  <div class="container">
  <div style=" background-color: services[log.service].color" class="box" :class="{ 'active': showBox }" v-if="selectedService && showBox">
      <h2>Logs for {{ selectedService }}</h2>
      <div v-for="(logs, index) in filteredLogs" :key="index">
        <ul>
          <li style="text-align: left" v-for="log in logs.logs" :key="log.logDetails" sty>
            <pre>{{ JSON.stringify(log, null, 2) }}</pre>
          </li>
    </ul>
        <!-- <p>{{ log.logs }}</p> -->
      </div>
    </div>
  </div>

  <div v-if="errorMessage">
    <p>{{ errorMessage }}</p>
  </div>
</template>

<script>
import axios from "axios"
export default {
name: 'IDForm',
data () {
  return {
    id: '',
    result:'',
    logs: [],
    showResult: false,
    errorMessage: '',
    selectedService: '',
    showBox: false
  }
},
computed: {
      services() {
        const services = {};
        this.logs.forEach(log => {
          if (!services[log.service]) {
            services[log.service] = {
              service: log.service,
              color: "",
              timestamp:log.timestamp
            };
          }
          
          if (log.level === "ERROR") {
            services[log.service].color = "#f34a66";
          } else if (log.level === "WARN") {
            services[log.service].color = "#fe9930";
          } else if (log.level === "INFO") {
            services[log.service].color = "#12b712";
          }
        });
        console.log(services)

        let prevTimestamp = null;
        for (const serviceName in services) {
          const service = services[serviceName];

          if (prevTimestamp!=null && prevTimestamp === service.timestamp) {
              console.log(`Service ${serviceName} has the same timestamp as the previous service`);
            }
          prevTimestamp = service.timestamp;
        }
        return Object.values(services);
    },
    filteredLogs() {
      if (this.selectedService) {
        //return this.logs[1]
         return this.logs.filter(log => log.service === this.selectedService)
      } else {
        return this.logs;
      }
    }
  },
methods: {
  async submit() {
    try {
    this.errorMessage = '';
    const response = await axios.get('https://aaz5y6zj31.execute-api.ap-south-1.amazonaws.com/dev/search-logs/',{params: {id:this.id}})
    
    this.logs = response.data
    this.showResult = true 
    console.log(this.logs)
    // Generate JSON file
    // const json = JSON.stringify(response.data);
    // const filename = `${this.id}.json`;
    // const blob = new Blob([json], { type: 'application/json' });
    // const href = await URL.createObjectURL(blob);
    // const link = document.createElement('a');
    // link.href = href;
    // link.download = filename;
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
  } catch (error) {
    // console.error(error);
    this.errorMessage = `No logs found with LogCorrelationId ${this.id}`;
    this.showResult=false
    this.showBox= false
  }
    },
    showLogs(service) {
      this.selectedService = service;
    },
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.box {
  padding: 2%;
  height: 0;
  overflow: hidden;
  border: 1px solid black;
  width: 500px;
  transition: height 0.3s ease-in-out;
}

.box.active {
  height: 200px; /* Set the desired height of the box */
  overflow: auto;
  width: 500px;
}
form{
  max-width: 420px;
  margin: 30px auto;
  background: #fff;
  text-align: left;
  padding: 40px;
  border-radius: 10px;
}
input{
  display: block;
  padding: 10px 6px;
  width: 100%;
  box-sizing: border-box;
  border: none;
  border-bottom: 1px solid #ddd;
  color: #555;
}
label{
  color:#aaa;
  display: inline-block;
  margin: 25px 0 15px;
  font-size: 0.6em;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: bold;
}
button{
  background: blue;
  border: 0;
  padding: 10px 20px;
  margin-top:20px;
  color:#fff;
  border-radius: 20px;
}
.submit{
  text-align: center;
}
.flowchart {
  /* styles for flowchart container */
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.log-block {
  /* styles for flowchart nodes */
  width: 100px;
  height: 50px;
  border-radius: 7%;
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
