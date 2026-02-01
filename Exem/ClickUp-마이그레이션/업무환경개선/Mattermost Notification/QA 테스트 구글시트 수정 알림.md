# QA 테스트 구글시트 수정 알림

## 작업내용
구글 Apps Script 기능을 이용해서 스프레드 시트에서 특정 이벤트가 발생하면 Matter most 의 incoming webhook 으로 전달

![](https://t25540965.p.clickup-attachments.com/t25540965/98582bb9-1282-4fd4-8007-8586ee1c3418/image.png)

## 구현방법

1. 이벤트를 트리거할 구글시트의 Apps Script 에 함수를 작성하고 이벤트 트리거를 등록

![](https://t25540965.p.clickup-attachments.com/t25540965/4f79eba7-d6fc-49d7-ab7a-a3a49c6e96ec/image.png)
![](https://t25540965.p.clickup-attachments.com/t25540965/93f5f32f-d088-4b90-87f7-ac9d4be5e910/image.png)

```javascript
function onEdit(e, isRecheck = false){
  // Destructuring properties from the event object
  const { range, value } = e;

  // Column indices and other constants
  const noColumnIdx = 2;
  const issueColumnIdx = 8;
  const targetSheetName = '이슈 리스트';
  const trigerStateList = ['Open', 'Reopened'];

  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const refSheet = activeSpreadsheet.getSheetByName(targetSheetName);
  const activSheet = activeSpreadsheet.getActiveSheet();

  // Getting issue details from the active sheet
  const issueText = refSheet.getRange(range.rowStart, issueColumnIdx).getValue().toString();
  const issueNo = refSheet.getRange(range.rowStart, noColumnIdx).getValue();
  const [firstRow = '', secondRow = ''] = issueText.split('\n');

  // Checking if 'client' text is present in firstRow or secondRow
  const isClientIssue = firstRow.toLowerCase().includes('client') || secondRow.toLowerCase().includes('client');
  const isIssueTextEmpty = issueText == '';

  const refSheetId = refSheet.getSheetId().toString();
  const hyperlinkUrl = `${activeSpreadsheet.getUrl()}#gid=${refSheetId}&range=A${range.rowStart}:O${range.rowEnd}`;
  const payload = {
    text: `**${value} Issue [No.${issueNo}](${hyperlinkUrl})**
\`\`\`
${firstRow}${secondRow ? `\n${secondRow}` : ''}
\`\`\``,
  };

  // 트리거 조건
  const messagePostCondition =
      ((!isRecheck && activSheet.getName() === targetSheetName) || isRecheck)
  &&  range.columnEnd === 16 // 콤보박스가 위치한 P 컬럼의 인덱스
  &&  trigerStateList.some(state => state === value)
  &&  !isIssueTextEmpty
  &&  isClientIssue;

  if (messagePostCondition) {
    UrlFetchApp.fetch('https://chat.exem.io/hooks/1zq78rspcb895ds1qj1kx9mw8w', {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload)
    });
  }
  if (isIssueTextEmpty && !isRecheck) {
    const tenMinutesInMillis = 10 * 60 * 1000; // 10 minutes in milliseconds
    const triggerTime = new Date().getTime() + tenMinutesInMillis;

    const triggers = ScriptApp.getProjectTriggers();
    for (let i = 0; i < triggers.length; i++) {
      if (triggers[i].getHandlerFunction() === "recheckIssueText") {
        ScriptApp.deleteTrigger(triggers[i]);
      }
    }

    ScriptApp.newTrigger("recheckIssueText")
      .timeBased()
      .at(new Date(triggerTime))
      .create();
    PropertiesService.getUserProperties().setProperty('eventRange', JSON.stringify(e.range));
    PropertiesService.getUserProperties().setProperty('eventValue', JSON.stringify(e.value));
  }
}

function recheckIssueText() {
    let range = JSON.parse(PropertiesService.getUserProperties().getProperty('eventRange'));
    let value = JSON.parse(PropertiesService.getUserProperties().getProperty('eventValue'));
    onEdit({ range, value }, true);
}
```

![](https://t25540965.p.clickup-attachments.com/t25540965/7e67b6d5-55a0-43c4-b722-fc6b78705453/image.png)

2. Matter Most 의 integration 에 incoming webhook 을 생성

![](https://t25540965.p.clickup-attachments.com/t25540965/37e1551c-bfc6-4f8a-863e-c99c42692f07/image.png)
![](https://t25540965.p.clickup-attachments.com/t25540965/a2b4f3f3-753b-4720-92fd-149a56f789e7/image.png)

---
*ClickUp 원본: https://app.clickup.com/25540965/docs/rbeb5-443818/rbeb5-1471640*
