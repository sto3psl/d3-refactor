import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'

const AreaChart = ({ dataset, width, height, marginLeft, marginTop }) => {
  const ref = useRef()

  useEffect(() => {
    const group = d3.select(ref.current)
    const formatDate = () => {
      const formatedData = dataset.map(dp => ({
        date: d3.timeParse('%Y-%m-%dT%H:%M:%S')(dp.date),
        price: dp.price
      }))
      return formatedData
    }

    const finalizedData = formatDate()

    const x = d3
      .scaleTime()
      .domain([d3.min(finalizedData.map(dp => dp.date)), d3.max(finalizedData.map(dp => dp.date))])
      .range([0, width])
    group
      .append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(x))

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(finalizedData.map(dp => dp.price))])
      .range([height, 0])
    group.append('g').call(d3.axisLeft(y))

    let bisect = d3.bisector(dp => dp.x).left

    const focus = group
      .append('g')
      .append('circle')
      .style('fill', 'none')
      .attr('stroke', 'black')
      .attr('r', 8.5)
      .style('opacity', 0)

    const focusText = group
      .append('g')
      .append('text')
      .style('opacity', 0)
      .attr('text-anchor', 'left')
      .attr('alignment-baseline', 'middle')

    group
      .append('rect')
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .attr('width', width)
      .attr('height', height)
      .on('mouseover', mouseover)
      .on('mousemove', mousemove)
      .on('mouseout', mouseout)

    group
      .append('path')
      .datum(finalizedData)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr(
        'd',
        d3
          .line()
          .x(d => x(d.date))
          .y(d => y(d.price))
      )

    // What happens when the mouse move -> show the annotations at the right positions.
    const mouseover = () => {
      focus.style('opacity', 1)
      focusText.style('opacity', 1)
    }

    function mousemove() {
      // recover coordinate we need
      let x0 = x.invert(d3.mouse(this)[0])
      let i = bisect(finalizedData, x0, 1)
      let selectedData = finalizedData[i]
      focus.attr('cx', x(selectedData.date)).attr('cy', y(selectedData.price))
      focusText
        .html(`date: ${selectedData.date} -  price: ${selectedData.price}`)
        .attr('x', x(selectedData.date) + 15)
        .attr('y', y(selectedData.price))
    }
    const mouseout = () => {
      focus.style('opacity', 0)
      focusText.style('opacity', 0)
    }

    /*
    var x = d3.scaleTime()
        .domain([d3.min(finalizedData.map(dp => dp.date)), d3.max(finalizedData.map(dp => dp.date))])
        .range([ 0, width ]);
        group.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

      var y = d3.scaleLinear()
        .domain([0, d3.max(finalizedData.map(dp => dp.value))])
        .range([ height, 0 ]);
        group.append("g")
        .call(d3.axisLeft(y));

      group.append("path")
        .datum(finalizedData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
          .x(function(dp) { return x(dp.date) })
          .y(function(dp) { return y(dp.value) })
          )
          */
  }, [])

  return (
    <>
      <svg width={width} height={height}>
        <g ref={ref} transform={`translate(${marginLeft} ${marginTop})`} />
      </svg>
    </>
  )
}

AreaChart.displayName = 'AreaChart'
AreaChart.protoTypes = {}

export default AreaChart
