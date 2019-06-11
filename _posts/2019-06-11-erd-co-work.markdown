---
layout: post
title: "ERD 협업! Aquerytool 소개"
date: 2019-06-07
author: 강성욱
categories: Post
//tag : database,query,erd
cover: "/assets/chipmunk.jpg"
---


# AQueryTool
Web 환경에서 간단하게 ERD를 그려볼 수 있는 Tool 이 있어 소개 해 보려고 합니다. 
간단하게 ERD 를 그리고 관계를 설정하고, Query를 뽑아낼때 생산성 측면에서  활용이 가능할것으로 생각됩니다. 
관련 소개와 도움말과 관련해서는 [해당 링크](https://aquerytool.com/help/index/){: target="blank"}를 참조하시면 더 자세하게 설명되어 있습니다. 

<br>
<br>
## 1. 회원 가입 및 로그인
- AQuueryTool : [https://aquerytool.com](https://aquerytool.com/){: target="blank"} 에 접속
- 회원가입을 하지않아도 ERD 작성하고, 관련 SQL을 생성할 수 있지만, 작성한 ERD를 저장하거나 공유, 불러오기등을 위해서는 회원가입 및 로그인이 필요합니다.

![](/assets/posting/20190611/Untitled-30cd790a-28ff-4517-8f5f-08d73b051108.png)
![](/assets/posting/20190611/Untitled-412d67c2-3e08-4fae-91f8-a905cde0c3c0.png)

<br><br>
## 2  테이블 추가 및 ERD 초기 정보 설정
- 로그인 하지 않고 사용할 수 있습니다. 저장하지 않은 ERD는 다시 불러올 수 없습니다.  이점을 주의하여 사용하여 주십시오. 간단하게 활용만 한다면, 회원가입 할 필요는 없습니다.
- 오른쪽 마우스 버튼을 누르면 다음과 같은 버튼이 나타나며, 테이블 추가가 가능합니다.

![](/assets/posting/20190611/Untitled-321b7e11-b3c4-4b14-96b5-52b8e8a4f239.png)

- 처음테이블을 추가 했을때는 ERD 에 대한 초기설정 팝업이 표시 됩니다.
- DataBase Type 과 (ORACLE , MySQL, MSSQL, MariaDB) , ERD Name 등을 지정하게 되고, 로그인 하지 않을 시에 저장되지 않는다는 경고문구가 출력됩니다.
- 데이터 베이스 타입을 지정하면, 해당 DBMS에 맞는, 생성 SQL Query를 뽑아 낼 수 있습니다. 그 밖에도, 자주 사용하는 쿼리등을 참조하면, 해당 테이블의 생성 , 삭제 , 연관테이블과의 조인 쿼리도 생성해주니 활용해보시면 좋을 것 같습니다.

![](/assets/posting/20190611/Untitled-f263d7ba-c842-4375-8db5-03b42c9dbebd.png)
<br><br>
## 3. 테이블 인터페이스 설명
테이블이 생성되면  다음과 같은 인터페이스를 가지게 되고 테이블 마다 메뉴를 통해 여러 작업을 수행할 수 있습니다. 

![](/assets/posting/20190611/Untitled-b1875d11-cd5a-44c1-9380-93c7389c267f.png)

<br><br>

### Table User Interface 간단 설명
![](/assets/posting/20190611/Untitled-a5b5830c-38bd-4708-b91d-a538d2a319b6.png)
<br><br>

### SQL / Model Menu
- 테이블 생성 SQL  - 해당 테이블을 생성하는 SQL 을 작성해 줍니다.

![](/assets/posting/20190611/Untitled-62fa686e-a445-43cb-89e9-59acafc7a064.png)

- 즐겨 쓰는 SQL  : 아래와 같은 기능들이 포함
    - 테이블 복사 , 백업
    - Select
    - Paging Select
    - Insert , Update, Delete

![](/assets/posting/20190611/Untitled-21c9ffbc-40f5-44e9-92c0-3ad0496c859c.png)

- 테스트 데이터 생성 : 해당 테이블의 테스트 데이터 생성 
- Java 모델 생성 : Java 모델(Data Class) 자동 생성
- C# 모델 생성 : C# 모델(Data Class) 자동 생성

![](/assets/posting/20190611/Untitled-25a91f05-0f01-4058-a52b-9814b78c22dc.png)

- Json 모델 생성 : Json 모델 자동 생성
<br><br>

## 4. 테이블 간의 관계 설정
- FK 컬럼을 마우스로 드래그 하여 참조할 테이블의 컬럼에 드랍 하면 관계가 설정 됩니다.

![](/assets/posting/20190611/Untitled-a38c859a-ba8c-44a8-a7a9-9389da624e37.png)
<br><br>

## 5. 인덱스 설정
- 테이블 하단의 인덱스 설정 메뉴를 클릭 합니다.
- 인덱스로 설정하고 싶은 컬럼 값을 마우스로 드래그 & 드랍 하여 인덱스 카트에 삽입 합니다.
- 최종적으로 인덱스 카트에 담긴 인덱스를 추가 합니다.

![](/assets/posting/20190611/Untitled-af0f6363-cde9-4927-9927-cbe390862375.png)

![](/assets/posting/20190611/Untitled-d2beec55-671c-490a-9948-5ac73c9fb263.png)

![](/assets/posting/20190611/Untitled-36c5ebfd-8da0-4c83-a1e4-b6dbe3f1f522.png)
<br><br>

## 6. ERD Export - 모든 테이블 생성 SQL 파일 생성
- ERD에 그려져 있는 Table 들을 모두 생성하는 SQL 쿼리를 뽑아낼 수 있습니다.

![](/assets/posting/20190611/Untitled-0e1909c5-cf12-4038-a11a-15e5d5d1ca6f.png)

- 그 밖에도, 이미지파일로 저장하거나 엑셀등의 포맷으로 저장할 수 있습니다.
<br><br>

## 7. ERD Share - Read Only URL 생성
- 서버에 저장된 ERD를 읽기전용으로 공유할 수 있는 방법입니다. 아쉽게도 저장되지 않거나 로그인하지 않고 공유하는 방법은 없는 것 같습니다.
- 이 방법으로 공유된 링크는 비회원도 비밀번호를 입력하여 ERD에 읽기 전용으로 접근할 수 있습니다.

![](/assets/posting/20190611/Untitled-b25b1471-3eca-4416-ac91-64c6326581be.png)

![](/assets/posting/20190611/Untitled-3aebb9bd-f454-4b3b-bcd0-c971a11b6b3f.png)

- New Link 버튼을 누르면 다음과 같이 읽기권한이 부여된 접근 가능한 URL이 생성 됩니다.
- 비밀번호도 같이 부여되어, 공유 시 비밀번호도 같이 알려주어야 접근 가능 하니 주의하여 주시기 바랍니다.
<br><br>

## 8. ERD 공유 - 회원 간 공유 요청 및 허가
- 읽기전용 뿐만 아니라 같이 협업시 수정도 할 수 있게끔 회원간 ERD를 공유할 수 있습니다.

![](/assets/posting/20190611/Untitled-f2df4eda-4714-4b2e-8b18-f3c591500fdc.png)

![](/assets/posting/20190611/Untitled-c9cdb230-28e6-485f-a785-67acddd4d0bc.png)

- ERD 공유 설정을 누르면, 해당 ERD를 공유할 수 있는 Code를 발급해주는 설정 창이 나옵니다 .
- 해당 코드를 클립보드에 복사하여, 공유를 원하고자 하는 사용자에게 알려주시면 상대방이 ERD 사용 권한을 ERD 작성자에게 요청할 수 있습니다.

![](/assets/posting/20190611/Untitled-4ef697cb-85d5-48b6-ae7b-83909a169d6d.png)

- 접근 코드를 전달 받았다면, 다음 메뉴를 통해 공유 요청을 수행 할 수 있습니다.

![](/assets/posting/20190611/Untitled-4e0d056f-10bc-4f9b-8019-9741c29bd7d9.png)

- 다음과 같이 전달받은 코드를 입력하여 권한을 요청 합니다.
- ERD 의 최초 생성자는 권한 설정에서 권한 요청 목록을 확인하고, 권한을 부여해주면 됩니다. 쓰기 권한의 경우 실제 확인된 사용자만 부여하는것이 보안상 좋으니 주의 바랍니다.

![](/assets/posting/20190611/Untitled-2108606d-de5b-4125-81b8-df0cbddc1779.png)

- 권한이 잘 요청 되었다면, 다음과 같이 접근 권한 대기중 상태의 요청 건이 ERD 소유자 에게 보여지게되고, Edit , Read 권한을 부여한 후 저장 하여 주면 상대방이 ERD 불러오기를 통해 ERD 에 접근 할 수 있습니다.
- 권한 요청자는 권한이 부여된 후 ERD를 불러오기 메뉴를 통해 Load 할 수 있습니다.

![](/assets/posting/20190611/Untitled-f53eedff-c1eb-40c3-a3f9-b667f9ca29ea.png)

![](/assets/posting/20190611/Untitled-6e00d9b8-f641-4c7f-8aed-6ceb8a86841c.png)

끝.