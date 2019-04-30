---
layout: post
title: "[SQL SEVER] Lock -01. DeadLock 진단"
date: 2019-04-30
author: 최지선
categories: Post
//tag : sql, database, deadlock
cover: "/assets/digitalart.jpg"
---


<br>
## “새벽마다 Dead-Lock이 발생해서, DB서버가 뻗을려고 해요”
<br>
<br>
<br>
# <center>😱 😱 😱</center>
<br>
<br>
<br>
울 회사에는 아직 DBA 담당 조직이 셋팅되어 있지 않아, 가끔씩 SQL관련된 기술지원을 부탁 받곤 합니다. 
(Health Data Bank를 지향하는 우리 회사, Data관련 기초 체력이 부실하다는 자아 비판을 해봅니다.)

각설하고, [기술 블로그](http://tech.ubcare.co.kr/){: target="blank"}도 생겼으니, **Dead-Lock case 대처하는 방법**을 정리 하고, 공유를 해보고자 합니다.<br>
우선, Dead-Lock의 해결을 위해, 진단이 우선이니 진단하는 방법에 대해 포스트를 올립니다.
(이게 왜 발생하는지, 어떻게 발생 소지를 줄이는지, 등등은 별도로 포스팅 하겠슴다.)
<br>
<br>

## 1. Sp_lock 프로시져 활용하기
![](/assets/posting/20190430/1.png)<br>
SQL Server에 미리 정의된 procedure, sp_lock 입니다.
현재 서버에서 나타난 모든 lock의 상태를 확인할 수 있습니다. (~~헐 현재 잠금이 3천만개.. 눈을 질끈 감고, 외면…. 할 수 밖에 없는 현실~~)<br><br>
그런데 좀 보기 어렵습니다. 은혜로운 어느 한 고수가 [sp_lock2를 만들어서 널리 배포](http://vyaskn.tripod.com/code.htm#sp_lock2){: target="blank"}했는데, 이걸 이용하면 훨씬 보기가 좋아요. ([Source Code](http://vyaskn.tripod.com/code/sp_lock2.txt){: target="blank"})
<br>
<br>
실행해보면, 좀더, 자세하게 무슨 프로그램에서, 어떤 DB의 어떤 객체의 잠금 단위 (key, page, table 등) 및 잠금 모드까지 모두 확인할 수 있습니다.
![](/assets/posting/20190430/2.png)
* 잠금단위, 잠금모드는 무엇인지, 어떤 건 괜찮고(일상적이고) 어떤 건 나타나면 큰일나는지는 Lock에 대한 별도의 포스팅을 하도록 할께요. 이 데이터를 통해 **현재 Dead-lock이 걸린 spid**를 찾아내고, kill 하면 됩니다. <br>
* "kill [spid]" 를 쿼리창에 서 실행해주면 그 프로세스는 종료됩니다.
즉 위의 sp_lock을 이용한 잠금상태 확인은 현재 벌어진 사태를 확인 하고, 범인을 찾아 사살하는 방법입니다.
<br>
<br>
Q. 3천만개나 나오는데 어떻게 찾나고요?<br>
A. 보통은 몇 십개 안쪽으로 나와요...(~~저 서버 상태는 외면하고 싶어지는 군요...~~)


**1번 방법이 현재 벌어진 사태에 대비하는 방법이라면, dead-lock이라는 불행한 사태가 발생시 log를 자세히 남겨놓고, 이를 통해 추후 원인을 파악할 수 있겠습니다.😉**
<br>
<br>

## 2. 추적 플래그 설정 & SQL Log 살펴보기
SQL서버에는 추적 플래그 라는 것을 설정할 수 있고, 추적 플래그는 서버의 특성을 설정하거나 특정 동작을 변경하는데 사용됩니다.
이 추적 플래그 중, 1204, 1222 번 추적플래그는 DBA라면 둘 중 하나는 ~~묻지마 설정해주는~~ 필수적으로 서버에 설정해주는 dead-lock 모니터링 관련 추적플래그입니다.<br>(참조: [Microsoft DBCC TRACEON - Trace Flags (Transact-SQL)](https://docs.microsoft.com/ko-kr/sql/t-sql/database-console-commands/dbcc-traceon-trace-flags-transact-sql?view=sql-server-2017){: target="blank"})

- **1204**<br>Returns the resources and types of locks participating in a deadlock and also the current command affected. For more information. Scope: global only
- **1222**<br>Returns the resources and types of locks that are participating in a deadlock and also the current command affected, in an XML format that does not comply with any XSD schema. Scope: global only

<br>
### 추적 플래그 설정 확인하기
전역으로 해당 DB서버에 1222,1204 추적플래그가 설정되어 있는지 확인하는 쿼리문<br>(~~18개 서비스가 돌아가는 우리회사 서버…~~😂)
![](/assets/posting/20190430/3.png)
<br>
<br>
### 추적 플래그 설정하기
1222번 플래그만 설정해보도록 하겠습니다. 문법은 매우 간단!<br>뒤의 -1은 서버 전역에 설정한다는 의미 입니다. 그냥 -1 쓰시면 되요.
    
    DBCC TRACEON (1222,-1)

요렇게 설정하고 다시 tracestatus를 확인해보면, 이렇게 global로 설정이 되어 있음을 확인할 수 있고<br>
(이젠 18개의 서비스를 담당하는 이 DB서버만은 dead-lock이라는 불행한 사태가 일어나게 되면, 원인을 파악할 수 있게 됩니다.)
![](/assets/posting/20190430/4.png)
<br>
다른 서버 (지금 이 시간에도 3천만개의 lock이 존재하는…) 에 1222번 flag를 포스팅 전날 설정 해두었고,<br>오늘 출근 후 확인해보니, **SQL서버의 로그를 통해 10번 남짓 dead-lock이 발생**하였으며, 왜 발생하였는지 확인하였고, 담당 개발조직에게 수정 필요한 내용을 알려드릴 수 있었습니다.
<br>
<br>
로그를 확인하는 방법은 다음과 같습니다.<br><br>
**1. SSMS의 개체 탐색기 에서 SQL서버 로그를 더블 클릭 합니다.** <br>![](/assets/posting/20190430/5.png)<br>
**2. 로그파일 뷰어에서 검색을 누르고 “deadlock”을 입력 후, 확인을 누르면. 해당 로그로 커서가 이동하고요.** <br>![](/assets/posting/20190430/6.png)<br>
**3. 어려운 내용은 우선 치우고, 쿼리문만 찾아보니. 색칠된 쿼리가 딱 눈에 들어옵니다.** <br>![](/assets/posting/20190430/7.png)<br>
**4. 해결방안을 찾아 해당 쿼리를 수정해주면 됩니다.**<br>
<br>
<br>
**해결방안은 다음 포스트에서...😊**
<br>
To Be Continue…

