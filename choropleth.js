let body = d3.select("body")
let info = body.append("div").attr("id", "info")
//add title and description
info.append("h2")
    .attr("id", "title")
    .text("Very interesting map")

info.append("div")
    .attr("id", "description")
    .text("If you pay close attention, you can see that there is a number in a box that shows up, when you hover over the map. This number represents, how many intelligent people is in the county you are hovering above. You can also see that, if you take a look at the colors of each county - they are not all the same! Here is a legend that shows what particular color means:")

//add tooltip
let tooltip = body.append("div")
    .attr("id", "tooltip")
    .style("opacity", "0")

//create map
let width = 1000;
let height = 800;

let svg = body
    .append( "svg" )
    .attr("id", "map")
    .attr( "width", width )
    .attr( "height", height );

let geoPath = d3.geoPath();

fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json")
    .then((map)=>map.json())
    .then((map)=>{
        fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json")
            .then(data => data.json())
            .then(data=>{
                let color = d3.scaleLinear()
                    .domain([d3.min(data, d=>d.bachelorsOrHigher), d3.max(data, d=>d.bachelorsOrHigher)])
                    .range(["#add8e6", "black"])                    
                svg.selectAll( ".county" )
                    .data( topojson.feature(map, map.objects.counties).features )
                    .enter()
                    .append( "path" )
                    .attr("class", "county")
                    .attr("data-fips", d=>d.id)
                    .attr("data-education", d=>data.filter(a=>a.fips==d.id)[0].bachelorsOrHigher)
                    .attr( "d", geoPath )
                    .attr("fill", d=>color(data.filter(a=>a.fips==d.id)[0].bachelorsOrHigher))
                    .on("mouseover", (e, a, b)=>{
                        let pos = d3.event
                        tooltip.style("opacity", "1")
                            .attr("data-education", b[a].attributes["data-education"].value)
                            .attr("style", `left: ${pos.pageX+10}px; top: ${pos.pageY+10}px`)
                            .text(`${b[a].attributes["data-education"].value}%`)
                    })
                    .on("mousemove", ()=>{
                        let pos = d3.event
                        tooltip.attr("style", `left: ${pos.pageX+10}px; top: ${pos.pageY+10}px`)
                    })
                    .on("mouseout", (e, a, b)=>{
                        tooltip
                            .attr("style", "left: 0px; top: 0px; opacity: 0;")
                            .attr("data-education", "")
                            .text("")
                    });
                
                
                let w = 200
                let h = 50
                let xScale = d3.scaleLinear()
                    .domain([0, 100])
                    .range([0, w])
                let xAxis = d3.axisBottom(xScale)

                let legend = info.append("svg")
                    .attr("width", w)
                    .attr("height", h)
                    .attr("id", "legend")
                legend.selectAll("rect")
                    .data([0, 10, 20, 30, 40, 50, 60, 70, 80, 90])
                    .enter()
                    .append("rect")
                    .attr("width", 20)
                    .attr("height", 20)
                    .attr("x", d=>xScale(d))
                    .attr("y", 0)
                    .style("fill", d=>color(d))
                legend.append("g")
                    .attr("transform", "translate(10, 20)")
                    .call(xAxis)
            })
    })

