<script>
/**
 * Earning Reports component
 */
export default {
  data() {
    return {
      usersReport: {
        series: [22],
        chartOptions: {
          chart: {
            type: "radialBar",
            wight: 60,
            height: 60,
            sparkline: {
              enabled: true
            }
          },
          dataLabels: {
            enabled: false
          },
          colors: ["#5664d2"],
          stroke: {
            lineCap: "round"
          },
          plotOptions: {
            radialBar: {
              hollow: {
                margin: 0,
                size: "70%"
              },
              track: {
                margin: 0
              },
              dataLabels: {
                show: false
              }
            }
          }
        }
      },
      projectsReport: {
        series: [21],
        chartOptions: {
          chart: {
            type: "radialBar",
            wight: 60,
            height: 60,
            sparkline: {
              enabled: true
            }
          },
          dataLabels: {
            enabled: false
          },
          colors: ["#3d479a"],
          stroke: {
            lineCap: "round"
          },
          plotOptions: {
            radialBar: {
              hollow: {
                margin: 0,
                size: "70%"
              },
              track: {
                margin: 0
              },

              dataLabels: {
                show: false
              }
            }
          }
        }
      },
      vmReport: {
        series: [27],
        chartOptions: {
          chart: {
            type: "radialBar",
            wight: 60,
            height: 60,
            sparkline: {
              enabled: true
            }
          },
          dataLabels: {
            enabled: false
          },
          colors: ["#1cbb8c"],
          stroke: {
            lineCap: "round"
          },
          plotOptions: {
            radialBar: {
              hollow: {
                margin: 0,
                size: "70%"
              },
              track: {
                margin: 0
              },

              dataLabels: {
                show: false
              }
            }
          }
        }
      },
      cpuReport: {
        series: [40],
        chartOptions: {
          chart: {
            type: "radialBar",
            wight: 60,
            height: 60,
            sparkline: {
              enabled: true
            }
          },
          dataLabels: {
            enabled: false
          },
          colors: ["#eeb902"],
          stroke: {
            lineCap: "round"
          },
          plotOptions: {
            radialBar: {
              hollow: {
                margin: 0,
                size: "70%"
              },
              track: {
                margin: 0
              },

              dataLabels: {
                show: false
              }
            }
          }
        }
      },
      memoryReport: {
        series: [75],
        chartOptions: {
          chart: {
            type: "radialBar",
            wight: 60,
            height: 60,
            sparkline: {
              enabled: true
            }
          },
          dataLabels: {
            enabled: false
          },
          colors: ["#ff3d60"],
          stroke: {
            lineCap: "round"
          },
          plotOptions: {
            radialBar: {
              hollow: {
                margin: 0,
                size: "70%"
              },
              track: {
                margin: 0
              },

              dataLabels: {
                show: false
              }
            }
          }
        }
      },
      chargesReport: {
        series: [30],
        chartOptions: {
          chart: {
            type: "radialBar",
            wight: 60,
            height: 60,
            sparkline: {
              enabled: true
            }
          },
          dataLabels: {
            enabled: false
          },
          colors: ["#1cbb8c"],
          stroke: {
            lineCap: "round"
          },
          plotOptions: {
            radialBar: {
              hollow: {
                margin: 0,
                size: "70%"
              },
              track: {
                margin: 0
              },

              dataLabels: {
                show: false
              }
            }
          }
        }
      },
    };
  }
};
</script>

<template>
  <div class="card">
    <div class="card-body">
      <!-- <b-dropdown right toggle-class="arrow-none card-drop" class="float-right" variant="white"> -->
        <!-- <template v-slot:button-content>
          <i class="mdi mdi-dots-vertical"></i>
        </template> -->
        <!-- item-->
        <!-- <b-dropdown-item>Sales Report</b-dropdown-item> -->
        <!-- item-->
        <!-- <b-dropdown-item>Export Report</b-dropdown-item> -->
        <!-- item-->
        <!-- <b-dropdown-item>Profit</b-dropdown-item> -->
        <!-- item-->
        <!-- <b-dropdown-item>Action</b-dropdown-item> -->
      <!-- </b-dropdown> -->

      <h4 class="card-title mb-4">Reports</h4>
      <div class="text-center">
        <div class="row">
          <div class="col-sm-2">
            <div>
              <div class="mb-3">
                <apexchart
                  class="apex-charts"
                  height="100"
                  wight="100"
                  dir="ltr"
                  :series="usersReport.series"
                  :options="usersReport.chartOptions"
                ></apexchart>
              </div>
              <p class="text-muted mb-2">Users</p>
              <h5 class="mb-0">22%</h5>
            </div>
          </div>

          <div class="col-sm-2">
            <div class="mt-5 mt-sm-0">
              <div class="mb-3">
                <apexchart
                  class="apex-charts"
                  height="100"
                  wight="100"
                  dir="ltr"
                  :series="projectsReport.series"
                  :options="projectsReport.chartOptions"
                ></apexchart>
              </div>

              <p class="text-muted mb-2">Projects</p>
              <h5 class="mb-0">21%</h5>
            </div>
          </div>

          <div class="col-sm-2">
            <div class="mt-5 mt-sm-0">
              <div class="mb-3">
                <apexchart
                  class="apex-charts"
                  height="100"
                  wight="100"
                  dir="ltr"
                  :series="vmReport.series"
                  :options="vmReport.chartOptions"
                ></apexchart>
              </div>

              <p class="text-muted mb-2">VM's</p>
              <h5 class="mb-0">27%</h5>
            </div>
          </div>

          <div class="col-sm-2">
            <div class="mt-5 mt-sm-0">
              <div class="mb-3">
                <apexchart
                  class="apex-charts"
                  height="100"
                  wight="100"
                  dir="ltr"
                  :series="cpuReport.series"
                  :options="cpuReport.chartOptions"
                ></apexchart>
              </div>

              <p class="text-muted mb-2">CPU</p>
              <h5 class="mb-0">40%</h5>
            </div>
          </div>

          <div class="col-sm-2">
            <div class="mt-5 mt-sm-0">
              <div class="mb-3">
                <apexchart
                  class="apex-charts"
                  height="100"
                  wight="100"
                  dir="ltr"
                  :series="memoryReport.series"
                  :options="memoryReport.chartOptions"
                ></apexchart>
              </div>

              <p class="text-muted mb-2">Memory</p>
              <h5 class="mb-0">75%</h5>
            </div>
          </div>

          <div class="col-sm-2">
            <div class="mt-5 mt-sm-0">
              <div class="mb-3">
                <apexchart
                  class="apex-charts"
                  height="100"
                  wight="100"
                  dir="ltr"
                  :series="chargesReport.series"
                  :options="chargesReport.chartOptions"
                ></apexchart>
              </div>

              <p class="text-muted mb-2">Basic Changes</p>
              <h5 class="mb-0">30%</h5>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>