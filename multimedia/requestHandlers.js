var querystring = require("querystring"),
    fs = require("fs"),
    path = require("path"),
    nodeVideo = require("video"),
    formidable = require("formidable"),
    buffer = require("buffer");


// TEMP
/*
Copyright (c) 2008 notmasteryet

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/

/* generic readers */

var base64alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

/* RFC 4648 */

function Base64Reader(base64) {
    this.position = 0;
    this.base64 = base64;
    this.bits = 0;
    this.bitsLength = 0;
    this.readByte = function() {
        if (this.bitsLength == 0) {
            var tailBits = 0;
            while (this.position < this.base64.length && this.bitsLength < 24) {
                var ch = this.base64.charAt(this.position);
                ++this.position;
                if (ch > " ") {
                    var index = base64alphabet.indexOf(ch);
                    if (index < 0) throw "Invalid character";
                    if (index < 64) {
                        if (tailBits > 0) throw "Invalid encoding (padding)";
                        this.bits = (this.bits << 6) | index;
                    } else {
                        if (this.bitsLenght < 8) throw "Invalid encoding (extra)";
                        this.bits <<= 6;
                        tailBits += 6;
                    }
                    this.bitsLength += 6;
                }
            }

            if (this.position >= this.base64.length) {
                if (this.bitsLength == 0) return -1;
                else if (this.bitsLength < 24) throw "Invalid encoding (end)";
            }

            if (tailBits == 6) tailBits = 8;
            else if (tailBits == 12) tailBits = 16;
            this.bits = this.bits >> tailBits;
            this.bitsLength -= tailBits;
        }

        this.bitsLength -= 8
        var code = (this.bits >> this.bitsLength) & 0xFF;
        return code;
    };
    // extensions
    this.read = function(buffer, index, count) {
        var i = 0;
        while (i < count) {
            var rb = this.readByte();
            if (rb == -1) return i;
            buffer[index + i] = rb;
            i++;
        }
        return i;
    };
    this.skip = function(count) {
        for (var i = 0; i < count; i++) this.readByte();
    };
    this.readChar = function() {
        var rb = this.readByte();
        return rb == -1 ? null : String.fromCharCode(rb);
    };
    this.readChars = function(chars) {
        var txt = '';
        for (var i = 0; i < chars; i++) {
            var c = this.readChar();
            if (!c) return txt;
            txt += c;
        }
        return txt;
    };
    this.readInt = function() {
        var bytes = [];
        if (this.read(bytes, 0, 4) != 4) throw "Out of bounds";
        return (bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3];
    };
}

/*
Copyright (c) 2008 notmasteryet

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/

function BitReader(reader) {
    this.bitsLength = 0;
    this.bits = 0;
    this.reader = reader;
    this.readBit = function() {
        if (this.bitsLength == 0) {
            var nextByte = this.reader.readByte();
            if (nextByte < 0) throw new "Unexpected end of stream";
            this.bits = nextByte;
            this.bitsLength = 8;
        }

        var bit = (this.bits & 1) != 0;
        this.bits >>= 1;
        --this.bitsLength;
        return bit;
    };
    this.align = function() {
        this.bitsLength = 0;
    }
    this.readLSB = function(length) {
        var data = 0;
        for (var i = 0; i < length; ++i) {
            if (this.readBit()) data |= 1 << i;
        }
        return data;
    };
    this.readMSB = function(length) {
        var data = 0;
        for (var i = 0; i < length; ++i) {
            if (this.readBit()) data = (data << 1) | 1;
            else data <<= 1;
        }
        return data;
    };
}

/* inflate stuff - RFC 1950 */

var staticCodes, staticDistances;

var encodedLengthStart = new Array(3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258);

var encodedLengthAdditionalBits = new Array(0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0);

var encodedDistanceStart = new Array(1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577);

var encodedDistanceAdditionalBits = new Array(0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13);

var clenMap = new Array(16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15);

function buildCodes(lengths) {
    var codes = new Array(lengths.length);
    var maxBits = lengths[0];
    for (var i = 1; i < lengths.length; i++) {
        if (maxBits < lengths[i]) maxBits = lengths[i];
    }

    var bitLengthsCount = new Array(maxBits + 1);
    for (var i = 0; i <= maxBits; i++) bitLengthsCount[i] = 0;

    for (var i = 0; i < lengths.length; i++) {
        ++bitLengthsCount[lengths[i]];
    }

    var nextCode = new Array(maxBits + 1);
    var code = 0;
    bitLengthsCount[0] = 0;
    for (var bits = 1; bits <= maxBits; bits++) {
        code = (code + bitLengthsCount[bits - 1]) << 1;
        nextCode[bits] = code;
    }

    for (var n = 0; n < codes.length; n++) {
        var len = lengths[n];
        if (len != 0) {
            codes[n] = nextCode[len];
            nextCode[len]++;
        }
    }
    return codes;
}

function initializeStaticTrees() {
    var codes = new Array(288);
    var codesLengths = new Array(288);

    for (var i = 0; i <= 143; i++) {
        codes[i] = 0x0030 + i;
        codesLengths[i] = 8;
    }
    for (var i = 144; i <= 255; i++) {
        codes[i] = 0x0190 + i - 144;
        codesLengths[i] = 9;
    }
    for (var i = 256; i <= 279; i++) {
        codes[i] = 0x0000 + i - 256;
        codesLengths[i] = 7;
    }
    for (var i = 280; i <= 287; i++) {
        codes[i] = 0x00C0 + i - 280;
        codesLengths[i] = 8;
    }
    staticCodes = buildTree(codes, codesLengths);

    var distances = new Array(32);
    var distancesLengths = new Array(32);
    for (var i = 0; i <= 31; i++) {
        distances[i] = i;
        distancesLengths[i] = 5;
    }
    staticDistances = buildTree(distances, distancesLengths);
}

function buildTree(codes, lengths) {
    var nonEmptyCodes = new Array(0);
    for (var i = 0; i < codes.length; ++i) {
        if (lengths[i] > 0) {
            var code = new Object();
            code.bits = codes[i];
            code.length = lengths[i];
            code.index = i;
            nonEmptyCodes.push(code);
        }
    }
    return buildTreeBranch(nonEmptyCodes, 0, 0);
}

function buildTreeBranch(codes, prefix, prefixLength) {
    if (codes.length == 0) return null;

    var zeros = new Array(0);
    var ones = new Array(0);
    var branch = new Object();
    branch.isLeaf = false;
    for (var i = 0; i < codes.length; ++i) {
        if (codes[i].length == prefixLength && codes[i].bits == prefix) {
            branch.isLeaf = true;
            branch.index = codes[i].index;
            break;
        } else {
            var nextBit = ((codes[i].bits >> (codes[i].length - prefixLength - 1)) & 1) > 0;
            if (nextBit) {
                ones.push(codes[i]);
            } else {
                zeros.push(codes[i]);
            }
        }
    }
    if (!branch.isLeaf) {
        branch.zero = buildTreeBranch(zeros, (prefix << 1), prefixLength + 1);
        branch.one = buildTreeBranch(ones, (prefix << 1) | 1, prefixLength + 1);
    }
    return branch;
}

function readDynamicTrees(bitReader) {
    var hlit = bitReader.readLSB(5) + 257;
    var hdist = bitReader.readLSB(5) + 1;
    var hclen = bitReader.readLSB(4) + 4;

    var clen = new Array(19);
    for (var i = 0; i < clen.length; ++i) clen[i] = 0;
    for (var i = 0; i < hclen; ++i) clen[clenMap[i]] = bitReader.readLSB(3);

    var clenCodes = buildCodes(clen);
    var clenTree = buildTree(clenCodes, clen);

    var lengthsSequence = new Array(0);
    while (lengthsSequence.length < hlit + hdist) {
        var p = clenTree;
        while (!p.isLeaf) {
            p = bitReader.readBit() ? p.one : p.zero;
        }

        var code = p.index;
        if (code <= 15) lengthsSequence.push(code);
        else if (code == 16) {
            var repeat = bitReader.readLSB(2) + 3;
            for (var q = 0; q < repeat; ++q)
            lengthsSequence.push(lengthsSequence[lengthsSequence.length - 1]);
        } else if (code == 17) {
            var repeat = bitReader.readLSB(3) + 3;
            for (var q = 0; q < repeat; ++q)
            lengthsSequence.push(0);
        } else if (code == 18) {
            var repeat = bitReader.readLSB(7) + 11;
            for (var q = 0; q < repeat; ++q)
            lengthsSequence.push(0);
        }
    }

    var codesLengths = lengthsSequence.slice(0, hlit);
    var codes = buildCodes(codesLengths);
    var distancesLengths = lengthsSequence.slice(hlit, hlit + hdist);
    var distances = buildCodes(distancesLengths);

    var result = new Object();
    result.codesTree = buildTree(codes, codesLengths);
    result.distancesTree = buildTree(distances, distancesLengths);
    return result;
}

function Inflator(reader) {
    this.reader = reader;
    this.bitReader = new BitReader(reader);
    this.buffer = new Array(0);
    this.bufferPosition = 0;
    this.state = 0;
    this.blockFinal = false;
    this.readByte = function() {
        while (this.bufferPosition >= this.buffer.length) {
            var item = this.decodeItem();
            if (item == null) return -1;
            switch (item.itemType) {
            case 0:
                this.buffer = this.buffer.concat(item.array);
                break;
            case 2:
                this.buffer.push(item.symbol);
                break;
            case 3:
                var j = this.buffer.length - item.distance;
                for (var i = 0; i < item.length; i++) {
                    this.buffer.push(this.buffer[j++]);
                }
                break;
            }
        }
        var symbol = this.buffer[this.bufferPosition++];
        if (this.bufferPosition > 0xC000) {
            var shift = this.buffer.length - 0x8000;
            if (shift > this.bufferPosition) shift = this.bufferPosition;
            this.buffer.splice(0, shift);
            this.bufferPosition -= shift;
        }
        return symbol;
    }

    this.decodeItem = function() {
        if (this.state == 2) return null;

        var item;
        if (this.state == 0) {
            this.blockFinal = this.bitReader.readBit();
            var blockType = this.bitReader.readLSB(2);
            switch (blockType) {
            case 0:
                this.bitReader.align();
                var len = this.bitReader.readLSB(16);
                var nlen = this.bitReader.readLSB(16);
                if ((len & ~nlen) != len) throw "Invalid block type 0 length";

                item = new Object();
                item.itemType = 0;
                item.array = new Array(len);
                for (var i = 0; i < len; ++i) {
                    var nextByte = this.reader.readByte();
                    if (nextByte < 0) throw "Uncomplete block";
                    item.array[i] = nextByte;
                }
                if (this.blockFinal) this.state = 2;
                return item;
            case 1:
                this.codesTree = staticCodes;
                this.distancesTree = staticDistances;
                this.state = 1;
                break;
            case 2:
                var dynamicTrees = readDynamicTrees(this.bitReader);
                this.codesTree = dynamicTrees.codesTree;
                this.distancesTree = dynamicTrees.distancesTree;
                this.state = 1;
                break;
            default:
                throw new "Invalid block type (3)";
            }
        }

        item = new Object();
        var p = this.codesTree;
        while (!p.isLeaf) {
            p = this.bitReader.readBit() ? p.one : p.zero;
        }
        if (p.index < 256) {
            item.itemType = 2;
            item.symbol = p.index;
        } else if (p.index > 256) {
            var lengthCode = p.index;
            if (lengthCode > 285) throw new "Invalid length code";

            var length = encodedLengthStart[lengthCode - 257];
            if (encodedLengthAdditionalBits[lengthCode - 257] > 0) {
                length += this.bitReader.readLSB(encodedLengthAdditionalBits[lengthCode - 257]);
            }

            p = this.distancesTree;
            while (!p.isLeaf) {
                p = this.bitReader.readBit() ? p.one : p.zero;
            }

            var distanceCode = p.index;
            var distance = encodedDistanceStart[distanceCode];
            if (encodedDistanceAdditionalBits[distanceCode] > 0) {
                distance += this.bitReader.readLSB(encodedDistanceAdditionalBits[distanceCode]);
            }

            item.itemType = 3;
            item.distance = distance;
            item.length = length;
        } else {
            item.itemType = 1;
            this.state = this.blockFinal ? 2 : 0;
        }
        return item;
    };
}

/* initialization */
initializeStaticTrees();

/*
    Credits by caliptus.eu
 */
function PNG(data) {
    var reader = new Base64Reader(data);
    reader.skip(8);
    var readChunk = function() {
            var length = reader.readInt(),
                type = reader.readChars(4),
                data = [];
            if (reader.read(data, 0, length) != length) throw 'Out of bounds';
            reader.skip(4);
            return {
                type: type,
                data: data
            };
        };
    var toInt = function(bytes, index) {
            return (bytes[index] << 24) | (bytes[index + 1] << 16) | (bytes[index + 2] << 8) | bytes[index + 3];
        };
    var colorType, colorTypes = {
        // gray
        0: function(reader) {
            var g = reader.readByte();
            return (g << 16) | (g << 8) | g;
        },
        // rgb
        2: function(reader) {
            var r = reader.readByte(),
                g = reader.readByte(),
                b = reader.readByte();
            return (r << 16) | (g << 8) | b;
        },
        // palette
        3: function(reader) {
            var b = reader.readByte();
            if (b == -1) return -1;
            return this.palette[b];
        },
        // gray + alpha
        4: function(reader) {
            var g = reader.readByte(),
                a = reader.readByte();
            return (g << 16) | (g << 8) | g;
        },
        // rgb + alpha
        6: function(reader) {
            var r = reader.readByte(),
                g = reader.readByte(),
                b = reader.readByte(),
                a = reader.readByte();
            return (r << 16) | (g << 8) | b;
        }
    };

    var filters = {
        0: function(reader) {
            var line = new Array(this.width);
            for (var x = 0; x < this.width; x++)
            line[x] = colorType.apply(this, [reader]);
            return line;
        },
        1: function(reader) {
            var line = new Array(this.width);
            var bpp = 4;
            var buffer = [];
            var newreader = {
                readByte: function() {
                    var rb = reader.readByte();
                    if (rb == -1) return -1;
                    if (buffer.length == bpp) rb = (rb + buffer.shift()) % 256;
                    buffer.push(rb);
                    return rb;
                }
            };
            for (var x = 0; x < this.width; x++)
            line[x] = colorType.apply(this, [newreader]);
            return line;
        },
        2: function() {
            throw 'Filter 2 not implemented';
        },
        3: function() {
            throw 'Filter 3 not implemented';
        },
        4: function() {
            throw 'Filter 4 not implemented';
        }
    };

    var colorType, dataChunks = [];
    do {
        var chunk = readChunk();
        var data = chunk.data;
        switch (chunk.type) {
        case 'IHDR':
            this.width = toInt(data, 0);
            this.height = toInt(data, 4);
            this.bitdepth = data[8];
            this.colorType = data[9];
            colorType = colorTypes[data[9]];
            if (data[10] != 0) throw 'Unknown compression method';
            if (data[11] != 0) throw 'Unknown filter';
            this.interlaced = data[12];
            break;
        case 'IDAT':
            dataChunks[dataChunks.length] = data;
            break;
        case 'PLTE':
            this.palette = [];
            for (var i = 0; i < data.length / 3; i++) {
                var di = i * 3;
                this.palette[i] = (data[di] << 16) | (data[di + 1] << 8) | data[di + 2];
            }
            break;
        };

    } while (chunk.type != 'IEND');

    var chunkReader = new Inflator({
        chunk: 0,
        index: 2,
        readByte: function() {
            if (this.chunk >= dataChunks.length) return -1;
            while (this.index >= dataChunks[this.chunk].length) {
                this.index = 0;
                this.chunk++;
                if (this.chunk >= dataChunks.length) return -1;
            }
            this.index++;
            return dataChunks[this.chunk][this.index - 1];
        }
    });

    this.readLine = function() {
        var filter = chunkReader.readByte();
        if (filter == -1) return null;
        return filters[filter].apply(this, [chunkReader]);
    };
}

String.prototype.padRight = function(c, n) {
    var txt = '';
    for (var i = 0; i < n - this.length; i++) txt += c;
    return txt + this;
};

function parseImageData(data) {
    var png = new PNG(data);
    var line;
    var imageMap = [];
    while (line = png.readLine()) {
        for (var x = 0; x < line.length; x++) {
            imageMap.push((line[x] & 0xFF0000) >> 16);
            imageMap.push((line[x] & 0xFF00) >> 8);
            imageMap.push(line[x] & 0xFF);
        }
    }
    return imageMap;
}


// TEMP

function encodeVideo(response, request) {
    console.log("Request handler 'encodeVideo' was called.");
    var form = new formidable.IncomingForm();
    console.log("Parsing data source...");
    form.parse(request, function(error, fields, files) {

        if (fields.videoName !== "") {
            var filePathName = './media/video/' + fields.videoName + '.ogv';
            var frameWidth = parseInt(fields.width) || 0;
            var frameHeight = parseInt(fields.height) || 0;
            var frameNumber = parseInt(fields.frameNumber);
            var pixelNumber = 0;
            var frameId = 0;
            var base64text;
            var base64imageData;
            var video;

            console.log("\nGenerating Video...");

            console.log("Setting video dimension to " + frameWidth + "x" + frameHeight);
            video = new nodeVideo.FixedVideo(parseInt(fields.width), parseInt(fields.height));

            console.log("Saving video to file '" + filePathName + "'");
            video.setOutputFile(filePathName);

            console.log("Reconstructing image structure of " + frameNumber + " frames...");
            for (frameId = 0; frameId < frameNumber; frameId++) {
                console.log("Reconstructing frame number " + frameId);
                base64text = fields['capturedFrames[' + frameId + ']'];
                base64imageData = base64text.substring(base64text.indexOf(",") + 1);
                imageMap = parseImageData(base64imageData);
                video.newFrame(new Buffer(imageMap));
            }

            console.log("Done!");
            video.end();
            console.log("Video saved successfully!");
        }

        response.writeHead(200, {
            "Content-Type": "text/html"
        });
        response.write("received image:<br/>");
        response.write("<img src='/show' />");
        response.end();
    });
}

function index(response) {
    fs.readFile('./index.html', function(error, content) {
        if (error) {
            response.writeHead(500);
            response.end();
        } else {
            response.writeHead(200, {
                'Content-Type': 'text/html'
            });
            response.end(content, 'utf-8');
        }
    });
}

function loader(response, request) {
    var filePath = '.' + request.url;
    contType = {
        '.js': 'text/javascript',
        '.css': 'text/css'
    };
    if (filePath == './') filePath = './index.html';
    var extname = path.extname(filePath);
    var contentType = contType[extname] || 'text/html';

    path.exists(filePath, function(exists) {

        if (exists) {
            fs.readFile(filePath, function(error, content) {
                if (error) {
                    response.writeHead(500);
                    response.end();
                } else {
                    response.writeHead(200, {
                        'Content-Type': contentType
                    });
                    response.end(content, 'utf-8');
                }
            });
        } else {
            response.writeHead(404);
            response.end();
        }
    });
}

function start(response) {
    console.log("Request handler 'start' was called.");

    var body = '<html>' + '<head>' + '<meta http-equiv="Content-Type" ' + 'content="text/html; charset=UTF-8" />' + '</head>' + '<body>' + '<form action="/upload" enctype="multipart/form-data" ' + 'method="post">' + '<input type="file" name="upload" multiple="multiple">' + '<input type="submit" value="Upload file" />' + '</form>' + '</body>' + '</html>';

    response.writeHead(200, {
        "Content-Type": "text/html"
    });
    response.write(body);
    response.end();
}

function upload(response, request) {
    console.log("Request handler 'upload' was called.");

    var form = new formidable.IncomingForm();
    console.log("about to parse");
    form.parse(request, function(error, fields, files) {
        console.log("parsing done");
        console.log(fields);

        /* Possible error on Windows systems:
       tried to rename to an already existing file */
        fs.rename(files.upload.path, "/tmp/test.png", function(err) {
            if (err) {
                fs.unlink("/tmp/test.png");
                fs.rename(files.upload.path, "/tmp/test.png");
            }
        });
        response.writeHead(200, {
            "Content-Type": "text/html"
        });
        response.write("received image:<br/>");
        response.write("<img src='/show' />");
        response.end();
    });
}

function show(response) {
    console.log("Request handler 'show' was called.");
    fs.readFile("/tmp/test.png", "binary", function(error, file) {
        if (error) {
            response.writeHead(500, {
                "Content-Type": "text/plain"
            });
            response.write(error + "\n");
            response.end();
        } else {
            response.writeHead(200, {
                "Content-Type": "image/png"
            });
            response.write(file, "binary");
            response.end();
        }
    });
}

exports.index = index;
exports.start = start;
exports.loader = loader;
exports.encodeVideo = encodeVideo;
exports.upload = upload;
exports.show = show;
