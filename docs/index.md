---
layout: default
---

<body>
  <div class="index-wrapper">
    <div class="index-content">
      <ul class="artical-list">
        {% for post in site.posts %}
          <li>
            <a href="{{site.url}}{{ post.url }}" class="title">{{ post.title }}</a>
            <div class="title-desc">{{ post.description }}</div>
            <div class="title-desc" style="float:right;">{{ post.categories }}  {{ post.date|date:"%Y-%m-%d" }}</div>
          </li>
        {% endfor %}
      </ul>
    </div>
  </div>
</body>
