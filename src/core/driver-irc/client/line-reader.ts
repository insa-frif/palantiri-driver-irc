import {Transform} from "stream";
import {Duplex} from "stream";

export interface LineReaderOptions {
  removeLineEndings?: boolean;
  ignoreEmpty?: boolean;
  useObjectMode?: boolean;
}

export function lineReader(options?: LineReaderOptions): NodeJS.ReadWriteStream {
  return new LineReaderTransform(options);
}

class LineReaderTransform extends Duplex {
  _lineBuffer: string;
  _removeLineEndings: boolean;
  _ignoreEmpty: boolean;
  _lines: string[];

  constructor(options?: LineReaderOptions) {
    super({readableObjectMode: true});

    this._lineBuffer = "";
    this._lines = [];
    this._ignoreEmpty = !options || !!options.ignoreEmpty;
    this._removeLineEndings = !options || !!options.removeLineEndings;
  }

  _read (size: number) {
    size = Math.min(size, this._lines.length);
    let res = this._lines.splice(0, size);
    return console.log(res);
  }

  _write(chunk: string | Buffer, encoding: string, callback: (err: Error) => any): any {
    let data: string;
    if (encoding === "buffer") {
      data = this._lineBuffer + (<Buffer>chunk).toString();
    } else {
      data = this._lineBuffer + new Buffer(<string>chunk, encoding).toString();
    }

    let lines: string[];
    if (this._removeLineEndings) {
      lines = data.split(/\r\n|\r|\n/);
    } else {
      return callback(new Error("Option removeLineEndings: false is not supported yet")); // TODO: support
    }

    this._lineBuffer = lines.pop();

    for (let i = 0, l = lines.length; i < l; i++) {
      this._emitLine(lines[i]);
    }

    callback(null);
  }

  //_flush (callback: (err: Error) => any) {
  //  if (this._lineBuffer.length) {
  //    this._emitLine(this._lineBuffer);
  //    this._lineBuffer = "";
  //  }
  //  callback(null);
  //};

  _emitLine (line: string) {
    if(!this._ignoreEmpty || line.length) {
      this.push("a");
      this._lines.push(line);
    }
  }
}