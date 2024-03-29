---
layout: post
title: "SQL - Four Part Naming의 함정"
date: 2019-02-28
author: 최지선
categories: Post
//tag : sql, database
cover: "/assets/fullstack.jpg"
---

  

내 DB서버에 없는 정보를 다른 DB서버를 Linked Server로 연결해서 쿼리하는 경우가 많습니다.
본 게시글에서는 **연결된 서버에 쿼리를 실행할 때 주의사항**을 공유합니다.

  

<br>

# Four Part Naming
아래 쿼리문은 특정 DB서버에 고객정보가 저장되어 있고, 다른 DB서버에서 그 서버의 정보를 조회하는 쿼리입니다.

이 중 FROM 절에 사용된 [서버명].[DB명].[소유자명].[테이블명] 과 같이 사용하는 것을 **Four Part Naming** 이라고 합니다.

  

![](/assets/posting/20190228/3.png){: width="100%" height="100%"}

  

**😵이것은 사용하기엔 쉬우나 성능이 안 좋으니 다른 방법을 사용해야 합니다.**

  
  

<br>

# 4 Part Name vs Open Query
4 part Naming과 오픈쿼리의 성능을 비교해 보았습니다.
<br>쿼리 결과는 동일하게 나타나지만...
![](/assets/posting/20190228/1.png){: width="100%" height="100%"}
  
프로파일러에서 보면 놀라운 결과가 나타납니다!!!
<br>쿼리 실행시간이 앞의 것 ***(4 Part Naming 사용)은 0.6초***, 뒤의 것 ***(Open Query) 는 0.005 초***
![](/assets/posting/20190228/2.png){: width="100%" height="100%"}

  
<br>
# 왜 이렇게 차이가 많이 나는가?
 
Four Part Naming을 이용할 경우
1. 실행계획을 내 DB서버에서 만들어 실행하고
2. 내 DB서버에 있는 테이블이 아니니까 (예제의 경우 4개의 테이블이 있지요) 각 테이블 마다 스키마 정보, 인덱스정보, 통계정보를 받아 오기 때문에 **네트워크 비용이 발생**합니다. 😵
원격서버에서 프로파일러로 쳐다보면 한 테이블당 3번인가 4번인가 정보를 질의하는 것이 보입니다.

  반면, Open Query를 이용할 경우
1.  원격서버에서 실행계획을 세워서 결과만 내 DB서버에 전달해 줍니다.
2. 원격서버는 자신의 테이블정보를 이미 알고 있으니 실행계획을 바로 세워서 결과만 짠 하고 전송해 주게 됩니다.

<br>
# 덧
위의 예제의 4 Part Naming 방식의 쿼리를 만들어 실행해보면 두 번째부터는 빠르게 실행됩니다. 아마 받아온 정보를 그대로 활용한은 듯 한데, 실제로는 벌어지지 않을일이니 안심하면 안 됩니다. 
(세션이 새로 열리면 다시 받아 옴)

제일 좋은 방법은 **Open Query의 내용을 프로시져로 만들어 원격서버에 두고, 해당 프로시져를 호출**하면 그것이 BEST Practice가 아닐까 합니다.
