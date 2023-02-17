## ⚠️ Deprecated!

**This repository is deprecated.** <br />
A more up-to-date version of panel plugin examples is available here: https://github.com/grafana/grafana-plugin-examples#panel-plugins

**Examples:**
- [panel-basic](https://github.com/grafana/grafana-plugin-examples/blob/main/examples/panel-basic) - demonstrates how to build a panel plugin that uses the time series graph
- [panel-flot](https://github.com/grafana/grafana-plugin-examples/blob/main/examples/panel-flot) - demonstrates how to use the Flot plotting library in a panel plugin.
- [panel-plotly](https://github.com/grafana/grafana-plugin-examples/blob/main/examples/panel-plotly) - demonstrates how to use the Plotly graphing library in a panel plugin.

---

## Getting started

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

### demo show
- origin three nodes, which are Database Node(DSNode), testDB, and nacoDB
![image](https://github.com/EJaro00/CapSP3-JaegerGrafana-Plugin/blob/Maiqi/d-3-test-plugin/IMG/1.png)
- add subnode of testDB, which are tsDB-0, tsDB-1, and tsDB-2
![image](https://github.com/EJaro00/CapSP3-JaegerGrafana-Plugin/blob/Maiqi/d-3-test-plugin/IMG/2.png)
- connect already exist subnode
![image](https://github.com/EJaro00/CapSP3-JaegerGrafana-Plugin/blob/Maiqi/d-3-test-plugin/IMG/3.png)
