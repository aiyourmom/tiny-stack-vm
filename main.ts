import {mkdirSync,readdirSync,readFileSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
const I=process.env.MAKEFUN_INPUT_DIR??'/input',O=process.env.MAKEFUN_OUTPUT_DIR??'/output';
function run(p:Uint8Array,g:Uint8Array){
  const D=new Int32Array(256),C=new Int32Array(64),M=new Int32Array(256),U=new Uint8Array(65536);
  let s=0,c=0,q=0,t=0,n=0,j=0,e=0;
  try{
    for(;;){
      if(t>=1e6)throw 10;
      if(q<0||q>=p.length)throw 9;
      const o=p[q];
      if(!(o<8||(o>=16&&o<=34)||(o>=48&&o<=52)||o==64||o==65||(o>=80&&o<=83)))throw 5;
      const m=o==1?1:o==2?4:o>=48&&o<=51?2:0;
      if(q+m>=p.length)throw 9;
      t++;
      const x=q+1+m;
      q=x;
      switch(o){
        case 0:throw 0;
        case 1:
          if(s>255)throw 3;
          D[s++]=(p[x-1]<<24)>>24;
          break;
        case 2:
          if(s>255)throw 3;
          D[s++]=p[x-4]|p[x-3]<<8|p[x-2]<<16|p[x-1]<<24;
          break;
        case 3:
          if(s<1)throw 2;
          s--;
          break;
        case 4:
          if(s<1)throw 2;
          if(s>255)throw 3;
          D[s]=D[s-1];
          s++;
          break;
        case 5:{
          if(s<2)throw 2;
          const v=D[s-1];
          D[s-1]=D[s-2];
          D[s-2]=v;
          break;
        }
        case 6:
          if(s<2)throw 2;
          if(s>255)throw 3;
          D[s]=D[s-2];
          s++;
          break;
        case 7:{
          if(s<3)throw 2;
          const v=D[s-3];
          D[s-3]=D[s-2];
          D[s-2]=D[s-1];
          D[s-1]=v;
          break;
        }
        case 23:
          if(s<1)throw 2;
          D[s-1]=-D[s-1]|0;
          break;
        case 27:
          if(s<1)throw 2;
          D[s-1]=~D[s-1];
          break;
        case 16:case 17:case 18:case 19:case 20:case 21:case 22:
        case 24:case 25:case 26:case 28:case 29:case 30:case 32:case 33:case 34:{
          if(s<2)throw 2;
          const b=D[s-1],a=D[s-2];
          let r=0;
          if(o==16)r=(a+b)|0;
          else if(o==17)r=(a-b)|0;
          else if(o==18)r=Math.imul(a,b);
          else if(o==19){
            if(!b)throw 4;
            r=a===-2147483648&&b===-1?a:(a/b)|0;
          }else if(o==20){
            if(!b)throw 4;
            r=b===-1?0:a%b|0;
          }else if(o==21){
            if(!b)throw 4;
            r=Math.floor((a>>>0)/(b>>>0))|0;
          }else if(o==22){
            if(!b)throw 4;
            r=(a>>>0)%(b>>>0)|0;
          }else if(o==24)r=a&b;
          else if(o==25)r=a|b;
          else if(o==26)r=a^b;
          else if(o==28)r=a<<(b&31);
          else if(o==29)r=a>>(b&31);
          else if(o==30)r=(a>>>(b&31))|0;
          else if(o==32)r=a===b?1:0;
          else if(o==33)r=a<b?1:0;
          else r=(a>>>0)<(b>>>0)?1:0;
          s-=2;
          D[s++]=r;
          break;
        }
        case 48:
          q=x+(((p[x-2]|p[x-1]<<8)<<16)>>16);
          break;
        case 49:case 50:{
          if(s<1)throw 2;
          const v=D[--s];
          if(o==49?v==0:v!=0)q=x+(((p[x-2]|p[x-1]<<8)<<16)>>16);
          break;
        }
        case 51:
          if(c>63)throw 7;
          C[c++]=x;
          q=p[x-2]|p[x-1]<<8;
          break;
        case 52:
          if(c==0)throw 8;
          q=C[--c];
          break;
        case 64:{
          if(s<1)throw 2;
          const a=D[s-1];
          if(a<0||a>255)throw 6;
          D[s-1]=M[a];
          break;
        }
        case 65:{
          if(s<2)throw 2;
          const a=D[s-1],v=D[s-2];
          if(a<0||a>255)throw 6;
          s-=2;
          M[a]=v;
          break;
        }
        case 80:{
          if(s<1)throw 2;
          const b=Buffer.from(''+D[s-1]);
          if(n+b.length>65536)throw 11;
          s--;
          U.set(b,n);
          n+=b.length;
          break;
        }
        case 81:
          if(s<1)throw 2;
          if(n>65535)throw 11;
          U[n++]=D[--s]&255;
          break;
        case 82:
          if(s>255)throw 3;
          D[s++]=j<g.length?g[j++]:-1;
          break;
        case 83:
          if(s<1)throw 2;
          throw D[--s]&255;
      }
    }
  }catch(v){e=typeof v=='number'?v:1;}
  return{o:U.slice(0,n),e};
}
for(const id of readdirSync(I).sort()){
  const r=run(readFileSync(join(I,id,'program.bin')),readFileSync(join(I,id,'input.bin')));
  mkdirSync(join(O,id),{recursive:true});
  writeFileSync(join(O,id,'stdout.bin'),r.o);
  writeFileSync(join(O,id,'exit.txt'),r.e+'\n');
}
