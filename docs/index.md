---
layout: default
---

<body>
  <div class="index-wrapper">
    <div class="index-content">
      <ul class="artical-list">
        {% for post in site.posts %}
          <li>
            <h2 class="post-title"><a href="{{ post.url }}" class="title">{{ post.title }}</a></h2>
            <p class="post-date">{{ page.date|date:"%Y-%m-%d" }}</p>
            <div class="title-desc">{{ post.description }}</div>
          </li>
        {% endfor %}
      </ul>
    </div>
  </div>
</body>
