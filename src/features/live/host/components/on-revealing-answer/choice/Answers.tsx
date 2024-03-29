import { useTypedSelector } from "@/common/hooks/useTypedSelector";
import { useEffect, useRef, useState } from "react";
import { select, scaleBand, scaleLinear, max } from "d3";

type Props = {
  a?: ChoiceOption[];
};

export default function Answers({ a }: Props) {
  const mod = useTypedSelector((state) => state.mod);
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<SVGSVGElement>(null);
  const [answers, setAnswers] = useState<ChoiceOption[]>(
    a ? a : mod.value.answers
  );
  const [total, setTotal] = useState<number>(0);
  const [data, setData] = useState<
    { label: string; value: number; color: string }[]
  >([]);

  useEffect(() => {
    if (a) {
      setAnswers(a);
    } else {
      setAnswers(mod.value.answers);
    }
  }, [a]);

  useEffect(() => {
    if (data.length > 0) drawChart();
  }, [data]);

  useEffect(() => {
    if (!answers) return;
    let totalCount = 0;
    let ans = [];
    for (const answer of answers) {
      totalCount += answer.count;
      ans.push({
        label: answer.content,
        value: answer.count,
        color: answer.color,
      });
    }

    setTotal(totalCount);
    setData(ans);
  }, [answers]);

  function drawChart() {
    const svgNode = chartRef.current;
    const container = containerRef.current;
    if (!svgNode || !container) return;

    const computedStyle = getComputedStyle(container);
    const width =
      container.clientWidth - parseFloat(computedStyle.paddingRight);
    const height =
      container.clientHeight - parseFloat(computedStyle.paddingBottom);

    const labelWidth =
      max(data, (d) => {
        const svg = select("body").append("svg").attr("class", "count");
        const textElement = svg
          .append("text")
          .text(`${d.value}-${(((d.value - 1) / total) * 100).toFixed(2)}%`);
        const width = textElement?.node()?.getBBox().width;
        svg.remove();
        return width;
      }) || 0;
    const gap = parseFloat(computedStyle.paddingRight) / 2;
    const xScale = scaleLinear()
      .domain([0, max(data, (d) => d.value) || 0])
      .range([parseInt(computedStyle.paddingRight), width - labelWidth - gap]);
    const yScale = scaleBand()
      .domain(data.map((d, i) => `${d.label}-${i}`))
      .range([0, height])
      .padding(0.1);

    const svg = select(svgNode).attr("width", width).attr("height", height);
    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("path")
      .attr("class", "bar")
      .attr("d", (d, i) => {
        const x = 0;
        const y = yScale(`${d.label}-${i}`) || 0;
        const w = 0;
        const h = yScale.bandwidth();
        const borderRadius = 120 / data.length;
        return `
          M ${x} ${y}
          H ${d.value > 0 ? x + w - borderRadius : x + w}
          Q ${x + w} ${y} ${x + w} ${d.value > 0 ? y + borderRadius : y}
          V ${d.value > 0 ? y + h - borderRadius : y + h}
          Q ${x + w} ${y + h} ${d.value > 0 ? x + w - borderRadius : x + w} ${
          y + h
        }
          H ${x}
          V ${y}
          Z
        `;
      })
      .transition()
      .duration(1000)
      .attr("d", (d, i) => {
        const x = 0;
        const y = yScale(`${d.label}-${i}`) || 0;
        const w =
          d.value > 0
            ? xScale(d.value) || 0
            : parseFloat(computedStyle.paddingRight);
        const h = yScale.bandwidth();
        const borderRadius = 120 / data.length;
        return `
          M ${x} ${y}
          H ${d.value > 0 ? x + w - borderRadius : x + w}
          Q ${x + w} ${y} ${x + w} ${d.value > 0 ? y + borderRadius : y}
          V ${d.value > 0 ? y + h - borderRadius : y + h}
          Q ${x + w} ${y + h} ${d.value > 0 ? x + w - borderRadius : x + w} ${
          y + h
        }
          H ${x}
          V ${y}
          Z
        `;
      })
      .attr("fill", (d) => d.color)
      .attr("stroke", "black")
      .attr("stroke-width", 1);
    svg
      .selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", 0)
      .attr(
        "y",
        (d, i) => (yScale(`${d.label}-${i}`) || 0) + yScale.bandwidth() / 2
      )
      .transition()
      .duration(1000)
      .attr("x", (d) => xScale(d.value) - gap)
      .attr(
        "y",
        (d, i) => (yScale(`${d.label}-${i}`) || 0) + yScale.bandwidth() / 2
      )
      .attr("text-anchor", "end")
      .attr("alignment-baseline", "middle")
      .attr("fill", "black")
      .text((d) => (d.value > 0 ? d.label : ""));
    svg
      .selectAll(".count")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "count")
      .attr("x", 0)
      .attr(
        "y",
        (d, i) => (yScale(`${d.label}-${i}`) || 0) + yScale.bandwidth() / 2
      )
      .transition()
      .duration(1000)
      .attr("x", (d) =>
        d.value
          ? xScale(d.value) + gap
          : parseFloat(computedStyle.paddingRight) + gap
      )
      .attr(
        "y",
        (d, i) => (yScale(`${d.label}-${i}`) || 0) + yScale.bandwidth() / 2
      )
      .attr("text-anchor", "start")
      .attr("alignment-baseline", "middle")
      .attr("fill", "black")
      .text((d) =>
        d.value > 0
          ? `${d.value} - ${
              total > 0 ? ((d.value / total) * 100).toFixed(0) : 0
            }%`
          : `(${d.label})  ${d.value} - ${
              total > 0 ? ((d.value / total) * 100).toFixed(0) : 0
            }%`
      );
    svg.selectAll(".axis").remove();
  }

  return (
    <div
      ref={containerRef}
      className="h-full p-4 xs:p-6 md:p-8 lg:p-12 2xl:p-[2.5vw] !pt-0 !pl-0 w-full overflow-hidden"
    >
      <div className="relative text-[0.75em] xs:text-[1em] sm:text-[1.25em] w-full overflow-hidden">
        <svg className="font-sans-serif" ref={chartRef} />
        <span
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%23FFF' stroke-width='4' stroke-dasharray='5%2c 20' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`,
          }}
          className="absolute top-0 left-4 xs:left-6 left-:left-8 lg:left-12 2xl:left-[2.5vw] block h-full w-px z-20"
        />
      </div>
    </div>
  );
}
