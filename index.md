---
layout: default
title: Whole Person Check-In
---
{%- assign weeks = site.weeks | sort: "week" -%}

<header class="checkin-head">
  <p class="eyebrow">{{ site.series_name }} · {{ site.series_weeks }} weeks</p>
  <h1>Whole Person Check-In</h1>
  <p class="subtitle">Body, mind, emotions, spirit, and the people and places around you.</p>
</header>

<p class="lede">Each week, take a few honest minutes before and after class to notice where you are. Set one small, doable habit for the week, track it kindly, and look back on what changed. There's room here for the hard days and the wins.</p>

<div class="week-list">
{%- for n in (1..site.series_weeks) -%}
  {%- assign doc = weeks | where: "week", n | first -%}
  {%- if doc %}
  <a class="week-card" href="{{ doc.url | relative_url }}" data-week-card="{{ n }}">
    <span class="week-num">Week {{ n }}</span>
    <span class="week-date">{{ doc.date | date: "%b %-d" }}</span>
    <strong>{{ doc.title }}</strong>
    <span class="week-sub">{{ doc.subtitle }}</span>
    <span class="week-progress" data-progress="w{{ n }}"></span>
  </a>
  {%- else %}
  <div class="week-card upcoming">
    <span class="week-num">Week {{ n }}</span>
    <strong>Coming soon</strong>
  </div>
  {%- endif -%}
{%- endfor %}
</div>

<div class="card how">
  <h2>How it works</h2>
  <ol>
    <li><strong>Before class:</strong> reflect on your body, mind, and emotions, and rate how you're doing.</li>
    <li><strong>After class:</strong> rate yourself again and write down one small step for the week.</li>
    <li><strong>During the week:</strong> check off your habit and name a win, a challenge, and how home, family, or work played a part.</li>
    <li><strong>Over the series:</strong> visit <a href="{{ '/journey/' | relative_url }}">My journey</a> to see how you've grown since week 1.</li>
  </ol>
  <p class="hint">Your answers stay in this browser on this device. If you switch phones or clear your browser, use "Copy my answers" or "Print" each week to keep a copy.</p>
</div>
