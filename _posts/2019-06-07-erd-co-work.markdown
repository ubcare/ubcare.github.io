---
layout: post
title: "ERD 협업! AqueryTool 소개"
date: 2019-06-07
author: 강성욱
categories: Post
//tag : database,query,erd
cover: "/assets/chipmunk.jpg"
---

<br>
안녕하세요, 연구실 기반기술개발팀의 강성욱입니다.<br>
현재 진행중인 프로젝트에서 Web 기반의 ERD Tool을 사용하고 있습니다.<br>
심플한 디자인과 간단한 공유 기능 덕분에 협업하기 좋아 여러분께 소개해 드립니다 😄
<br>
<br>

# AQueryTool
[AQueryTool](https://aquerytool.com/help/index/){: target="blank"}은 웹 기반의 ERD 툴 + SQL 자동 생성 프로그램입니다.
기존에도 SQL 자동 생성을 지원하는 툴이 많이 있긴하나 
Web 환경에서 쉽게 ERD를 작성하고 협업하는 과정, Query를 뽑아낼때 생산성 측면에서 더욱 활용도가 높을 것으로 생각됩니다. 
<br>
<br>
## 1. 회원 가입 및 로그인
- AQueryTool : [https://aquerytool.com](https://aquerytool.com/){: target="blank"} 에 접속
- 회원가입을 하지않아도 ERD 작성하고, 관련 SQL을 생성할 수 있지만, 저장하거나 공유, 불러오기등을 위해서는 회원가입 및 로그인이 필요합니다.
- 저장을 원하지 않으시고 사용하시려면 로그인 과정없이 사용하셔도 됩니다.
![](https://aquerytool.com/images/help/PIC8C0.png)

<br>
<br>
## 2. 테이블 추가 및 ERD 생성
- 간단하게 테이블을 추가해 보겠습니다. 
![](https://aquerytool.com/images/help/PIC900.png)

- 처음 테이블을 추가하면 자동으록 ERD 설정 팝업이 나타납니다.
- 데이터 베이스 타입을 지정하면, 해당 DBMS에 맞는, 생성 SQL Query를 뽑아 낼 수 있습니다.
- 현재 지원하고 있는 DB 종류는 다음과 같습니다. <br>(Oracle , MSSQL , MySQL , MariaDB)

![](https://aquerytool.com/images/help/PIC930.png)
<br>
<br>
## 3. 생성된 테이블 인터페이스에 대한 설명
![](https://aquerytool.com/images/help/PIC941.png)
[![](/assets/posting/20190607/ui.png)](https://www.notion.so/9807d5a69a724d45923f9eb6e38de2c4){: target="blank"}
<br>
### SQL / Model Menu
- 즐겨쓰는 SQL : 많이 쓰는 SQL 생성
- 테스트 데이터 생성 : 테스트 데이터 생성
- Java 모델 생성 : Java 모델(Data Class) 자동 생성
- C# 모델 생성 : C# 모델(Data Class) 자동 생성
- Json 모델 생성 : Json 모델 자동 생성
<br>
<br>

## 4. 관계 설정

FK 컬럼을 마우스로 드래그 하여 참조할 테이블의 컬럼에 드랍 하면 관계가 설정 됩니다.<br>
간단하쥬 🙃
![](https://aquerytool.com/images/help/PICA08.png)
<br>
<br>

## 5. 인덱스 설정
- 테이블 우측 하단의 버튼을 클릭하면 인덱스 설정 팝업이 나타납니다.
- 하나의 인덱스로 설정할 컬럼들을 Index cart에 드래그&드랍으로 추가 합니니다.
- 하나의 인덱스로 설정할 컬럼들을 모두 Index cart에 추가 했으면 주황색 Add Index 버튼을 클릭해서 하나의 인덱스로 설정합니다.이렇게 설정한 Index는 Create Table 관련 SQL을 생성할 때 반영됩니다.

![](https://aquerytool.com/images/help/PICA8A.png)

![](https://aquerytool.com/images/help/PICAAA.png)
<br>
<br>

## 6. ERD Export - 모든 테이블 생성 SQL 파일 생성
- 상단 도구모음에서 [ERD] - [모든 테이블 생성 SQL] 메뉴를 선택하면 ERD에 포함된 모든 테이블에 대한 Create Table 관련 SQL문이 txt 파일로 생성됩니다.
- 그 밖에도, 이미지파일로 저장하거나 엑셀등의 포맷으로 저장할 수 있습니다.

![](https://aquerytool.com/images/help/PICC8F.png)
<br>
<br>

## 7. ERD 공유 1 - Read Only URL 생성
- 서버에 저장된 ERD만 공유 할 수 있습니다.
- 이 방법은 비회원도 ERD에 읽기 전용으로 접근할 수 있습니다.

![](https://aquerytool.com/images/help/PIC101B.png)

![](https://aquerytool.com/images/help/PIC102C.png)

New Link 버튼을 클릭하면 ERD 바로 가기 주소와 비밀번호가 자동으로 만들어집니다.
Clipboard Copy 버튼을 클릭하여 주소와 비밀번호를 클립보드로 복사한 후
다른 사람에게 이메일이나 메신저로 전달하면 간단하게 해당 ERD를 공유할 수 있습니다.
<br>
<br>

## 8. ERD 공유 2 - 회원 간 공유 요청 및 허가

![](https://aquerytool.com/images/help/PIC108B.png)

![](https://aquerytool.com/images/help/PIC10AC.png)

- 상단 Clipboard Copy 버튼을 클릭하여 현재 ERD의 고유키를 클립보드로 복사한 후 다른 회원에게 이메일이나 메신저로 전달합니다.
- ERD 고유키를 받은 다른 회원은 상단 도구모음에서 [ERD] - [공유 요청] 메뉴를 선택하면 아래와 같은 팝업이 나타납니다.

![](https://aquerytool.com/images/help/PIC10CC.png)

![](https://aquerytool.com/images/help/PIC10EC.png)

- 여기에 전달 받은 ERD 고유키를 입력해서 해당 ERD에 대한 권한 요청을 할 수 있습니다.
- ERD 생성 회원은 상단 도구모음에서 [ERD] - [공유 설정] 메뉴를 선택하면 아래와 같은 팝업이 나타납니다.

![](https://aquerytool.com/images/help/PIC110C.png)

![](https://aquerytool.com/images/help/PIC111D.png)

- 여기에서 접근 권한을 신청한 회원에게 읽기, 쓰기 권한을 줄 수 있습니다. 물론 쓰기 권한은 매우 신중하게 설정하는 것을 추천 드립니다.
- 이렇게 다른 회원에게 ERD 접근 권한을 주면 다른 회원은 상단 도구모음에서 [ERD] - [ERD 불러오기] 메뉴를 선택해서 권한을 받은 ERD를 불러올 수 있습니다.

![](https://aquerytool.com/images/help/PIC112E.png)

![](https://aquerytool.com/images/help/PIC114E.png)

끝.