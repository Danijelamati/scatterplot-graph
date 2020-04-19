fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json").
then(res => res.json()).
then(res => {

  const dataset = res.map(x => [x.Doping, x.Name, x.Nationality, x.Place, x.Seconds, x.Time, x.URL, x.Year]);
  console.log(dataset[0]);
  const svgWidth = 925;
  const svgHeight = 500;

  const padding = 75;

  const width = svgWidth - padding * 2;
  const height = svgHeight - padding;

  const xScale = d3.scaleLinear().
  domain([d3.min(dataset, x => x[7] - 1), d3.max(dataset, x => x[7]) + 1]).
  range([0, width]);

  const yScale = d3.scaleTime().
  domain(setYDomain()).
  range([height, 50]);

  function setYDomain() {
    const a = d3.extent(dataset, x => x[5]);

    const m = a[0].split(":");
    const min = new Date(0, 0, 0, 0, 0, 0, 0);

    min.setMinutes(m[0]);
    min.setSeconds(m[1]);

    const mx = a[1].split(":");
    const max = new Date(0, 0, 0, 0, 0, 0, 0);

    max.setMinutes(mx[0]);
    max.setSeconds(mx[1]);

    return [max, min];
  }

  function date(x) {
    let date = new Date(0, 0, 0, 0, 0, 0, 0);
    const d = x.split(":");
    date.setMinutes(d[0]);
    date.setSeconds(d[1]);
    return date;
  }

  const svg = d3.select("svg").
  attr("width", svgWidth).
  attr("height", svgHeight);

  const xAxis = d3.axisBottom(xScale).
  tickFormat(d3.format("d"));
  const yAxis = d3.axisLeft(yScale).
  tickFormat(d3.timeFormat("%M:%S"));

  const tooltip = d3.tip().
  attr("id", "tooltip").
  html(x => {
    d3.select("#tooltip").attr("data-year", x[7]);
    return `${x[1]} <br> ${x[2]} <br> Time: ${x[5]} <br> Year: ${x[7]} <br> ${x[0] === "" ? " No aligations" : x[0]}`;
  });

  const legend = d3.select("svg").
  attr("id", "legend");

  svg.call(tooltip);

  svg.append("g").
  attr("id", "x-axis").
  attr("transform", "translate(" + padding + "," + height + ")").
  call(xAxis);

  svg.append("g").
  attr("id", "y-axis").
  attr("transform", "translate(" + padding + ", 0)").
  call(yAxis);

  svg.selectAll("circle").
  data(dataset).
  enter().
  append("circle").
  attr("class", "dot").
  attr("data-xvalue", x => x[7]).
  attr("data-yvalue", x => date(x[5])).
  attr("cx", x => xScale(x[7]) + padding).
  attr("cy", x => yScale(date(x[5]))).
  attr("r", 5).
  attr("fill", x => x[0] === "" ? "navy" : "red").
  on('mouseover', tooltip.show).
  on('mouseout', tooltip.hide);

  legend.append("rect").
  attr("x", width - padding / 9).
  attr("y", height / 6).
  attr("height", 15).
  attr("width", 15).
  attr("fill", "navy");

  legend.append("text").
  attr("x", width - padding / 9 + 20).
  attr("y", height / 6 + 15).
  text("No doping aligations");


  legend.append("rect").
  attr("x", width - padding / 9).
  attr("y", height / 6 + 25).
  attr("height", 15).
  attr("width", 15).
  attr("fill", "red");

  legend.append("text").
  attr("x", width - padding / 9 + 20).
  attr("y", height / 6 + 40).
  text("Doping aligations");

});