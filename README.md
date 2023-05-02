# Capstone-Project3
##  Anti-pattern detection in Jaeger/Grafana tracking tool for microservices: Jaeger/Grafana Plugin
For our group, we picked the [Train-Ticket](https://github.com/FudanSELab/train-ticket) Microservice OSS Project.

## Team
Team Leader: `Eric Jaroszewski`

Team Members: `Evan Berryman`,`Yangzekun Gao`,`Zhengyan Hu`,`Maiqi Hou`

---
## Log Trace File
Our group provides a `Jaeger Tracing.exe` to help users to trace each microservices and comprehensive a completed local file. 

Once you open the executable file, it allows users to enter an IP address and a port, which is the IP and port of your developed Jaeger.
We also offer two options for tracing mode: `5m`-traceing recently 5 minutes data and `ALL`-tracing data within 2 days.

![exefile]()

After you enter the above information, you can access http://localhost:5000 in your browser. It will show a "Hello, World!" page, which means you access using http://localhost:5000/logging and it is your tracing file. All of our Grafana data source get their data from this URL.

![exefile1]()

![exefile2]()


---
## Grafana panel
Download the train-ticket-plugin folder, using VS code open it, and call the terminal to run these commands.
1. Install dependencies

   ```bash
   yarn install
   ```

2. Build plugin in development mode or run in watch mode

   ```bash
   yarn dev
   ```

   or

   ```bash
   yarn watch
   ```

3. Build plugin in production mode

   ```bash
   yarn build
   ```