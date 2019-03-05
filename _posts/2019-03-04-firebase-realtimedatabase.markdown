---
layout: post
title: "실시간 데이터베이스 사용기 (Fireabase) 1탄"
date: 2019-03-04
author: 이현진
categories: Post
//tag : mobile, firebase, database
cover: "/assets/connection.jpg"
---

지난 해, 구글의 **Firebase Realtime Database**를 이용하여 모바일 앱의 기능을 구현했습니다.
<br>혹시 저와 같은 고민을 하시는 분이 계실까 하여 경험을 공유합니다.
![](/assets/posting/20190304/1.png)

<br>
# 보통의 서버-클라이언트 구성
<br>
![](/assets/posting/20190304/severclient.png){: width="70%" height="70%"}

대부분 위와 같이 클라이언트-서버를 구성합니다.<br>
**이 상태로 제품을 만들고 운영하다 보면 어딘가에 데이터를 저장하고,<br> 제품(앱)에서 그 데이터를 이용해야 하는 경우가 생깁니다.**

<br>
보통 이러한 상황에는
1. 관리자페이지를 만들거나 (신규 개발)
2. 운영자가 직접 DB에 값을 넣거나 합니다. (DB 무단접근)

![](/assets/posting/20190304/serverclientmanager.png){: width="70%" height="70%"}
<br>
그런데 관리자페이지를 새로 만드려면 매우 귀찮고 비용이 들죠.
<br>
그렇다고 개발자가 DB에 직접 접속하여 값을 변경하는 것도 보안에 우려되고요.
<br>
<br>
그래서 이 참에 [Firebase Realtime Database](https://firebase.google.com/docs/database/?hl=ko)를 이용해 보기로 했습니다.


<br>
# Firebase 실시간 데이터베이스는
<iframe width="494" height="278" src="https://www.youtube.com/embed/U5aeM5dvUpA?list=PLl-K7zZEsYLmOF_07IayrTntevxtbUxDL" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="">
</iframe>
1. 권한을 설정하여 데이터를 읽고 쓸 수 있고
2. 콘솔 페이지에서 직접 데이터를 수정할 수 있고
3. NoSQL이라 비교적 스키마 구성이 간단하고
4. 여러가지 클라이언트 SDK를 제공하고
5. 무엇보다 일단 무료입니다. (용량/동접 UP -> 유료로 환승 가능)
![](/assets/posting/20190304/04.png){: width="70%" height="70%"}

<br>
관리자 페이지 대신에 Firebase 실시간 데이터베이스를 적용할 경우 아키텍쳐가 이렇게 변경됩니다.
![](/assets/posting/20190304/serverclientfirebasemanager.png){: width="70%" height="70%"}


- 관리자기 Firebase Console (웹페이지)을 통해 데이터를 입력하면 Database에 반영되고, 실시간으로 클라이언트에 전달됩니다.
실시간입니다! 여러분! 실시간!!

- Firebase가 데이터 입력 화면, Database, API, SDK를 세트로 제공해 주기 때문에
**레거시는 그대로 유지하고 Client와 Firebase간의 연결만으로 새 기능을 추가할 수 있습니다.

- Firebase는 각종 클라이언트(iOS/Android/웹...) 마다 SDK나 코드를 제공하기에 구현도 매우 간단합니다.


<br>
# 서버리스?
서버 인프라 없이 간단한 채팅 프로그램도 금세 만들 수 있겠죠?
 ![](/assets/posting/20190304/serverless.png){: width="70%" height="70%"}
<br>손쉽게 채팅앱 개발도 가능합니다.



<br>
# 어디에 써먹을까?

우리는 가끔 고민하죠. 
<br>별 것도 아닌데 모든 클라이언트에서 일시적으로 서버에 접속하는 그것.

바로 바로 바로 
**버전체크(업데이트)** 기능입니다.


유비케어 제품이 워낙 많은 병의원에 설치되어 있다 보니 특정 시간마다 
<br>제품 버전체크로 인한 부하가 좀 있는 걸로 알고 있습니다.

이러한 가벼운 기능을 외부 서비스에 위임한다면
자사 서비스의 부하를 줄일 수 있지 않을까 상상했습니다.


다음에는
“유비케어 전자문서 앱” 의 버전체크(업데이트) 기능에
실시간 데이터베이스를 적용한 구현 사례를 공유하겠습니다.
<br>기대해 주세요. 👋

