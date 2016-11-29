---
layout: default
---

<body>
  <div class="index-wrapper">
    <div class="index-content">
      <ul class="artical-list">
        {% for category in site.categories %}
          {% for post in category %}
            <li>
              <a href="{{ post.url }}" class="title">{{ post.title }}</a>
              <div class="title-desc">{{ post.description }}</div>
            </li>
          {% endfor %}
        {% endfor %}
      </ul>
    </div>
  </div>
</body>
