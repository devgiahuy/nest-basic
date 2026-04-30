export enum TodoStatus {
  OPEN = 'OPEN',
  INPROGRESS = 'INPROGRESS',
  DONE = 'DONE',
}

// nếu ko gán cho chuối kí tự thì nó sẽ gán cho OPEN = 0, INPROGRESS = 1, DONE = 2
// nếu gán cho chuỗi kí tự thì nó sẽ gán cho OPEN = 'OPEN', INPROGRESS = 'INPROGRESS', DONE = 'DONE'
