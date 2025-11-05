import svgPaths from "./svg-4g7hb7p1mh";
import imgImageWorkspaceSetup from "figma:asset/e4e504c58fbcb6230c59beef695b16fbe8fe88b3.png";
import imgImageCoffeeDesk from "figma:asset/67f24e8419bff5e3effca5aeac1f68520faf2d60.png";
import imgImageCityNight from "figma:asset/6a20dad0a2060f128b266554ad538181742a2399.png";
import imgImageCozyFireplace from "figma:asset/e374b7b9b02565a79afc8e0e9ac1f5a4c481a49b.png";
import imgImageModernOffice from "figma:asset/da5a87cad34dcd0319518b0bbcc51faf3db35ef2.png";
import imgImageMinimalWorkspace from "figma:asset/61b0fff9c1d9e886808c6789c33a22ffaef23630.png";
import imgImageCoffeeShop from "figma:asset/192af493d73e4ba06f57647df86412d7f6734cdd.png";
import imgImageCleanDesk from "figma:asset/3a35058b4c5bf03083d31fd4c86fd047908b1f55.png";
import imgImageTechSetup from "figma:asset/ee6c6566a2c4207720feb27b22629f96cf8684d5.png";
import imgImageOutdoorRetreat from "figma:asset/64b5945d0c833517f084c03a6366a90ee64597da.png";
import imgImageCityLights from "figma:asset/485b3b869a4d8360bed2602985dc92bfcaf7c432.png";
import imgImageHomeOffice from "figma:asset/7d227b3c875d7143f10ae00687b1c62f8f91a67e.png";
import imgImageCreativeStudio from "figma:asset/8ff8cb78f8f983f79c3084bcf75cc1c984a7b087.png";
import imgImageGreenWorkspace from "figma:asset/17bcb77b2469b03f3311e66fab437d8ecba6c03f.png";
import imgImageWindowView from "figma:asset/32a5e4d38fca26b63cdcd385813bd12eed3b9291.png";
import imgImageMinimalistSetup from "figma:asset/6426cf12e085951769eeebcc2708664a2dae5068.png";
import imgImageTechHub from "figma:asset/a06408e54df43f9c738dcd3089bcde72551c4945.png";
import imgImageCafeLifestyle from "figma:asset/96e2bc22e61eebfca28d0962e6d5cdfbbc22b6b6.png";
import imgImageStudyLibrary from "figma:asset/5a5fb5f0433dad82935f5781fa980d43379a987f.png";
import imgImageBeachVibes from "figma:asset/fbbe577534c1049d13bec3ea15ceae95ad3c6072.png";
import imgImageCoworking from "figma:asset/21c2f3958d0db777c9faa8b3431d8539307525dc.png";
import imgImageDesignStudio from "figma:asset/ad8f8b2bf8550dfa0b4e3f3d92cac917f726d452.png";
import imgImageHotelRoom from "figma:asset/3863c729f32ee2f2b24b12d47f797149abeef58c.png";

function Heading() {
  return (
    <div className="h-[31.997px] relative shrink-0 w-full" data-name="Heading 1">
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[32px] left-[894.81px] not-italic text-[32px] text-center text-nowrap text-white top-[-0.89px] translate-x-[-50%] whitespace-pre">Choose Your Device Mockup</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[27.995px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[28px] left-[894.17px] not-italic text-[20px] text-[rgba(255,255,255,0.6)] text-center text-nowrap top-[-0.33px] tracking-[-0.4492px] translate-x-[-50%] whitespace-pre">Select a device shot to place your content on</p>
    </div>
  );
}

function Container() {
  return (
    <div className="h-[195.99px] relative shrink-0 w-full" data-name="Container">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[15.998px] h-[195.99px] items-start pb-0 pt-[120px] px-[63.993px] relative w-full">
          <Heading />
          <Paragraph />
        </div>
      </div>
    </div>
  );
}

function ImageWorkspaceSetup() {
  return (
    <div className="h-[255.703px] relative shrink-0 w-full" data-name="Image (Workspace Setup)">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageWorkspaceSetup} />
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute bg-[#1e2939] content-stretch flex flex-col h-[255.703px] items-start left-0 overflow-clip top-0 w-[340.938px]" data-name="Container">
      <ImageWorkspaceSetup />
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[27.995px] relative shrink-0 w-[154.627px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[27.995px] relative w-[154.627px]">
        <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[28px] left-0 not-italic text-[20px] text-nowrap text-white top-[-0.33px] tracking-[-0.4492px] whitespace-pre">Workspace Setup</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute bg-gradient-to-t box-border content-stretch flex from-[rgba(0,0,0,0.8)] h-[255.703px] items-end justify-center left-0 opacity-0 pb-[23.993px] pl-0 pr-[0.009px] pt-0 to-[rgba(0,0,0,0)] top-0 via-50% via-[rgba(0,0,0,0.2)] w-[340.938px]" data-name="Container">
      <Paragraph1 />
    </div>
  );
}

function Button() {
  return (
    <div className="absolute h-[255.703px] left-[42px] overflow-clip rounded-[10px] top-0 w-[340.938px]" data-name="Button">
      <Container1 />
      <Container2 />
    </div>
  );
}

function ImageCoffeeDesk() {
  return (
    <div className="h-[255.703px] relative shrink-0 w-full" data-name="Image (Coffee Desk)">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageCoffeeDesk} />
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute bg-[#1e2939] content-stretch flex flex-col h-[255.703px] items-start left-0 overflow-clip top-0 w-[340.938px]" data-name="Container">
      <ImageCoffeeDesk />
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[27.995px] relative shrink-0 w-[107.917px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[27.995px] relative w-[107.917px]">
        <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[28px] left-0 not-italic text-[20px] text-nowrap text-white top-[-0.33px] tracking-[-0.4492px] whitespace-pre">Coffee Desk</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute bg-gradient-to-t box-border content-stretch flex from-[rgba(0,0,0,0.8)] h-[255.703px] items-end justify-center left-0 opacity-0 pb-[23.993px] pt-0 px-0 to-[rgba(0,0,0,0)] top-0 via-50% via-[rgba(0,0,0,0.2)] w-[340.938px]" data-name="Container">
      <Paragraph2 />
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute h-[255.703px] left-[414.93px] overflow-clip rounded-[10px] top-0 w-[340.938px]" data-name="Button">
      <Container3 />
      <Container4 />
    </div>
  );
}

function ImageCityNight() {
  return (
    <div className="h-[255.703px] relative shrink-0 w-full" data-name="Image (City Night)">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageCityNight} />
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute bg-[#1e2939] content-stretch flex flex-col h-[255.703px] items-start left-0 overflow-clip top-0 w-[340.938px]" data-name="Container">
      <ImageCityNight />
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[27.995px] relative shrink-0 w-[87.066px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[27.995px] relative w-[87.066px]">
        <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[28px] left-0 not-italic text-[20px] text-nowrap text-white top-[-0.33px] tracking-[-0.4492px] whitespace-pre">City Night</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute bg-gradient-to-t box-border content-stretch flex from-[rgba(0,0,0,0.8)] h-[255.703px] items-end justify-center left-0 opacity-0 pb-[23.993px] pt-0 px-0 to-[rgba(0,0,0,0)] top-0 via-50% via-[rgba(0,0,0,0.2)] w-[340.938px]" data-name="Container">
      <Paragraph3 />
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute h-[255.703px] left-[787.87px] overflow-clip rounded-[10px] top-0 w-[340.938px]" data-name="Button">
      <Container5 />
      <Container6 />
    </div>
  );
}

function ImageCozyFireplace() {
  return (
    <div className="h-[255.703px] relative shrink-0 w-full" data-name="Image (Cozy Fireplace)">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageCozyFireplace} />
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute bg-[#1e2939] content-stretch flex flex-col h-[255.703px] items-start left-0 overflow-clip top-0 w-[340.938px]" data-name="Container">
      <ImageCozyFireplace />
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="h-[27.995px] relative shrink-0 w-[129.062px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[27.995px] relative w-[129.062px]">
        <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[28px] left-0 not-italic text-[20px] text-nowrap text-white top-[-0.33px] tracking-[-0.4492px] whitespace-pre">Cozy Fireplace</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="absolute bg-gradient-to-t box-border content-stretch flex from-[rgba(0,0,0,0.8)] h-[255.703px] items-end justify-center left-0 opacity-0 pb-[23.993px] pt-0 px-0 to-[rgba(0,0,0,0)] top-0 via-50% via-[rgba(0,0,0,0.2)] w-[340.938px]" data-name="Container">
      <Paragraph4 />
    </div>
  );
}

function Button3() {
  return (
    <div className="absolute h-[255.703px] left-[1160.8px] overflow-clip rounded-[10px] top-0 w-[340.938px]" data-name="Button">
      <Container7 />
      <Container8 />
    </div>
  );
}

function ImageModernOffice() {
  return (
    <div className="h-[255.703px] relative shrink-0 w-full" data-name="Image (Modern Office)">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageModernOffice} />
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute bg-[#1e2939] content-stretch flex flex-col h-[255.703px] items-start left-0 overflow-clip top-0 w-[340.938px]" data-name="Container">
      <ImageModernOffice />
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="h-[27.995px] relative shrink-0 w-[126.189px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[27.995px] relative w-[126.189px]">
        <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[28px] left-0 not-italic text-[20px] text-nowrap text-white top-[-0.33px] tracking-[-0.4492px] whitespace-pre">Modern Office</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="absolute bg-gradient-to-t box-border content-stretch flex from-[rgba(0,0,0,0.8)] h-[255.703px] items-end justify-center left-0 opacity-0 pb-[23.993px] pl-0 pr-[0.009px] pt-0 to-[rgba(0,0,0,0)] top-0 via-50% via-[rgba(0,0,0,0.2)] w-[340.938px]" data-name="Container">
      <Paragraph5 />
    </div>
  );
}

function Button4() {
  return (
    <div className="absolute h-[255.703px] left-[1533.73px] overflow-clip rounded-[10px] top-0 w-[340.938px]" data-name="Button">
      <Container9 />
      <Container10 />
    </div>
  );
}

function ImageMinimalWorkspace() {
  return (
    <div className="h-[255.703px] relative shrink-0 w-full" data-name="Image (Minimal Workspace)">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageMinimalWorkspace} />
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute bg-[#1e2939] content-stretch flex flex-col h-[255.703px] items-start left-0 overflow-clip top-0 w-[340.938px]" data-name="Container">
      <ImageMinimalWorkspace />
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="h-[27.995px] relative shrink-0 w-[170.642px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[27.995px] relative w-[170.642px]">
        <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[28px] left-0 not-italic text-[20px] text-nowrap text-white top-[-0.33px] tracking-[-0.4492px] whitespace-pre">Minimal Workspace</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="absolute bg-gradient-to-t box-border content-stretch flex from-[rgba(0,0,0,0.8)] h-[255.703px] items-end justify-center left-0 opacity-0 pb-[23.993px] pt-0 px-0 to-[rgba(0,0,0,0)] top-0 via-50% via-[rgba(0,0,0,0.2)] w-[340.938px]" data-name="Container">
      <Paragraph6 />
    </div>
  );
}

function Button5() {
  return (
    <div className="absolute h-[255.703px] left-[42px] overflow-clip rounded-[10px] top-[287.7px] w-[340.938px]" data-name="Button">
      <Container11 />
      <Container12 />
    </div>
  );
}

function ImageCoffeeShop() {
  return (
    <div className="h-[255.703px] relative shrink-0 w-full" data-name="Image (Coffee Shop)">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageCoffeeShop} />
    </div>
  );
}

function Container13() {
  return (
    <div className="absolute bg-[#1e2939] content-stretch flex flex-col h-[255.703px] items-start left-0 overflow-clip top-0 w-[340.938px]" data-name="Container">
      <ImageCoffeeShop />
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="h-[27.995px] relative shrink-0 w-[109.201px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[27.995px] relative w-[109.201px]">
        <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[28px] left-0 not-italic text-[20px] text-nowrap text-white top-[-0.33px] tracking-[-0.4492px] whitespace-pre">Coffee Shop</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="absolute bg-gradient-to-t box-border content-stretch flex from-[rgba(0,0,0,0.8)] h-[255.703px] items-end justify-center left-0 opacity-0 pb-[23.993px] pt-0 px-0 to-[rgba(0,0,0,0)] top-0 via-50% via-[rgba(0,0,0,0.2)] w-[340.938px]" data-name="Container">
      <Paragraph7 />
    </div>
  );
}

function Button6() {
  return (
    <div className="absolute h-[255.703px] left-[414.93px] overflow-clip rounded-[10px] top-[287.7px] w-[340.938px]" data-name="Button">
      <Container13 />
      <Container14 />
    </div>
  );
}

function ImageCleanDesk() {
  return (
    <div className="h-[255.703px] relative shrink-0 w-full" data-name="Image (Clean Desk)">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageCleanDesk} />
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute bg-[#1e2939] content-stretch flex flex-col h-[255.703px] items-start left-0 overflow-clip top-0 w-[340.938px]" data-name="Container">
      <ImageCleanDesk />
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="h-[27.995px] relative shrink-0 w-[99.358px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[27.995px] relative w-[99.358px]">
        <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[28px] left-0 not-italic text-[20px] text-nowrap text-white top-[-0.33px] tracking-[-0.4492px] whitespace-pre">Clean Desk</p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="absolute bg-gradient-to-t box-border content-stretch flex from-[rgba(0,0,0,0.8)] h-[255.703px] items-end justify-center left-0 opacity-0 pb-[23.993px] pt-0 px-0 to-[rgba(0,0,0,0)] top-0 via-50% via-[rgba(0,0,0,0.2)] w-[340.938px]" data-name="Container">
      <Paragraph8 />
    </div>
  );
}

function Button7() {
  return (
    <div className="absolute h-[255.703px] left-[787.87px] overflow-clip rounded-[10px] top-[287.7px] w-[340.938px]" data-name="Button">
      <Container15 />
      <Container16 />
    </div>
  );
}

function ImageTechSetup() {
  return (
    <div className="h-[255.703px] relative shrink-0 w-full" data-name="Image (Tech Setup)">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageTechSetup} />
    </div>
  );
}

function Container17() {
  return (
    <div className="absolute bg-[#1e2939] content-stretch flex flex-col h-[255.703px] items-start left-0 overflow-clip top-0 w-[340.938px]" data-name="Container">
      <ImageTechSetup />
    </div>
  );
}

function Paragraph9() {
  return (
    <div className="h-[27.995px] relative shrink-0 w-[98.654px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[27.995px] relative w-[98.654px]">
        <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[28px] left-0 not-italic text-[20px] text-nowrap text-white top-[-0.33px] tracking-[-0.4492px] whitespace-pre">Tech Setup</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="absolute bg-gradient-to-t box-border content-stretch flex from-[rgba(0,0,0,0.8)] h-[255.703px] items-end justify-center left-0 opacity-0 pb-[23.993px] pl-0 pr-[0.009px] pt-0 to-[rgba(0,0,0,0)] top-0 via-50% via-[rgba(0,0,0,0.2)] w-[340.938px]" data-name="Container">
      <Paragraph9 />
    </div>
  );
}

function Button8() {
  return (
    <div className="absolute h-[255.703px] left-[1160.8px] overflow-clip rounded-[10px] top-[287.7px] w-[340.938px]" data-name="Button">
      <Container17 />
      <Container18 />
    </div>
  );
}

function ImageOutdoorRetreat() {
  return (
    <div className="h-[255.703px] relative shrink-0 w-full" data-name="Image (Outdoor Retreat)">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageOutdoorRetreat} />
    </div>
  );
}

function Container19() {
  return (
    <div className="absolute bg-[#1e2939] content-stretch flex flex-col h-[255.703px] items-start left-0 overflow-clip top-0 w-[340.938px]" data-name="Container">
      <ImageOutdoorRetreat />
    </div>
  );
}

function Paragraph10() {
  return (
    <div className="h-[27.995px] relative shrink-0 w-[140.868px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[27.995px] relative w-[140.868px]">
        <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[28px] left-0 not-italic text-[20px] text-nowrap text-white top-[-0.33px] tracking-[-0.4492px] whitespace-pre">Outdoor Retreat</p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="absolute bg-gradient-to-t box-border content-stretch flex from-[rgba(0,0,0,0.8)] h-[255.703px] items-end justify-center left-0 opacity-0 pb-[23.993px] pt-0 px-0 to-[rgba(0,0,0,0)] top-0 via-50% via-[rgba(0,0,0,0.2)] w-[340.938px]" data-name="Container">
      <Paragraph10 />
    </div>
  );
}

function Button9() {
  return (
    <div className="absolute h-[255.703px] left-[1533.73px] overflow-clip rounded-[10px] top-[287.7px] w-[340.938px]" data-name="Button">
      <Container19 />
      <Container20 />
    </div>
  );
}

function ImageCityLights() {
  return (
    <div className="h-[255.703px] relative shrink-0 w-full" data-name="Image (City Lights)">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageCityLights} />
    </div>
  );
}

function Container21() {
  return (
    <div className="absolute bg-[#1e2939] content-stretch flex flex-col h-[255.703px] items-start left-0 overflow-clip top-0 w-[340.938px]" data-name="Container">
      <ImageCityLights />
    </div>
  );
}

function Paragraph11() {
  return (
    <div className="h-[27.995px] relative shrink-0 w-[93.177px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[27.995px] relative w-[93.177px]">
        <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[28px] left-0 not-italic text-[20px] text-nowrap text-white top-[-0.33px] tracking-[-0.4492px] whitespace-pre">City Lights</p>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="absolute bg-gradient-to-t box-border content-stretch flex from-[rgba(0,0,0,0.8)] h-[255.703px] items-end justify-center left-0 opacity-0 pb-[23.993px] pt-0 px-0 to-[rgba(0,0,0,0)] top-0 via-50% via-[rgba(0,0,0,0.2)] w-[340.938px]" data-name="Container">
      <Paragraph11 />
    </div>
  );
}

function Button10() {
  return (
    <div className="absolute h-[255.703px] left-[42px] overflow-clip rounded-[10px] top-[575.4px] w-[340.938px]" data-name="Button">
      <Container21 />
      <Container22 />
    </div>
  );
}

function ImageHomeOffice() {
  return (
    <div className="h-[255.703px] relative shrink-0 w-full" data-name="Image (Home Office)">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageHomeOffice} />
    </div>
  );
}

function Container23() {
  return (
    <div className="absolute bg-[#1e2939] content-stretch flex flex-col h-[255.703px] items-start left-0 overflow-clip top-0 w-[340.938px]" data-name="Container">
      <ImageHomeOffice />
    </div>
  );
}

function Paragraph12() {
  return (
    <div className="h-[27.995px] relative shrink-0 w-[110.703px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[27.995px] relative w-[110.703px]">
        <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[28px] left-0 not-italic text-[20px] text-nowrap text-white top-[-0.33px] tracking-[-0.4492px] whitespace-pre">Home Office</p>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="absolute bg-gradient-to-t box-border content-stretch flex from-[rgba(0,0,0,0.8)] h-[255.703px] items-end justify-center left-0 opacity-0 pb-[23.993px] pl-0 pr-[0.009px] pt-0 to-[rgba(0,0,0,0)] top-0 via-50% via-[rgba(0,0,0,0.2)] w-[340.938px]" data-name="Container">
      <Paragraph12 />
    </div>
  );
}

function Button11() {
  return (
    <div className="absolute h-[255.703px] left-[414.93px] overflow-clip rounded-[10px] top-[575.4px] w-[340.938px]" data-name="Button">
      <Container23 />
      <Container24 />
    </div>
  );
}

function ImageCreativeStudio() {
  return (
    <div className="h-[255.703px] relative shrink-0 w-full" data-name="Image (Creative Studio)">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageCreativeStudio} />
    </div>
  );
}

function Container25() {
  return (
    <div className="absolute bg-[#1e2939] content-stretch flex flex-col h-[255.703px] items-start left-0 overflow-clip top-0 w-[340.938px]" data-name="Container">
      <ImageCreativeStudio />
    </div>
  );
}

function Paragraph13() {
  return (
    <div className="h-[27.995px] relative shrink-0 w-[133.819px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[27.995px] relative w-[133.819px]">
        <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[28px] left-0 not-italic text-[20px] text-nowrap text-white top-[-0.33px] tracking-[-0.4492px] whitespace-pre">Creative Studio</p>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="absolute bg-gradient-to-t box-border content-stretch flex from-[rgba(0,0,0,0.8)] h-[255.703px] items-end justify-center left-0 opacity-0 pb-[23.993px] pt-0 px-0 to-[rgba(0,0,0,0)] top-0 via-50% via-[rgba(0,0,0,0.2)] w-[340.938px]" data-name="Container">
      <Paragraph13 />
    </div>
  );
}

function Button12() {
  return (
    <div className="absolute h-[255.703px] left-[787.87px] overflow-clip rounded-[10px] top-[575.4px] w-[340.938px]" data-name="Button">
      <Container25 />
      <Container26 />
    </div>
  );
}

function ImageGreenWorkspace() {
  return (
    <div className="h-[255.703px] relative shrink-0 w-full" data-name="Image (Green Workspace)">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageGreenWorkspace} />
    </div>
  );
}

function Container27() {
  return (
    <div className="absolute bg-[#1e2939] content-stretch flex flex-col h-[255.703px] items-start left-0 overflow-clip top-0 w-[340.938px]" data-name="Container">
      <ImageGreenWorkspace />
    </div>
  );
}

function Paragraph14() {
  return (
    <div className="h-[27.995px] relative shrink-0 w-[156.033px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[27.995px] relative w-[156.033px]">
        <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[28px] left-0 not-italic text-[20px] text-nowrap text-white top-[-0.33px] tracking-[-0.4492px] whitespace-pre">Green Workspace</p>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="absolute bg-gradient-to-t box-border content-stretch flex from-[rgba(0,0,0,0.8)] h-[255.703px] items-end justify-center left-0 opacity-0 pb-[23.993px] pl-0 pr-[0.009px] pt-0 to-[rgba(0,0,0,0)] top-0 via-50% via-[rgba(0,0,0,0.2)] w-[340.938px]" data-name="Container">
      <Paragraph14 />
    </div>
  );
}

function Button13() {
  return (
    <div className="absolute h-[255.703px] left-[1160.8px] overflow-clip rounded-[10px] top-[575.4px] w-[340.938px]" data-name="Button">
      <Container27 />
      <Container28 />
    </div>
  );
}

function ImageWindowView() {
  return (
    <div className="h-[255.703px] relative shrink-0 w-full" data-name="Image (Window View)">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageWindowView} />
    </div>
  );
}

function Container29() {
  return (
    <div className="absolute bg-[#1e2939] content-stretch flex flex-col h-[255.703px] items-start left-0 overflow-clip top-0 w-[340.938px]" data-name="Container">
      <ImageWindowView />
    </div>
  );
}

function Paragraph15() {
  return (
    <div className="h-[27.995px] relative shrink-0 w-[118.368px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[27.995px] relative w-[118.368px]">
        <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[28px] left-0 not-italic text-[20px] text-nowrap text-white top-[-0.33px] tracking-[-0.4492px] whitespace-pre">Window View</p>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="absolute bg-gradient-to-t box-border content-stretch flex from-[rgba(0,0,0,0.8)] h-[255.703px] items-end justify-center left-0 opacity-0 pb-[23.993px] pt-0 px-0 to-[rgba(0,0,0,0)] top-0 via-50% via-[rgba(0,0,0,0.2)] w-[340.938px]" data-name="Container">
      <Paragraph15 />
    </div>
  );
}

function Button14() {
  return (
    <div className="absolute h-[255.703px] left-[1533.73px] overflow-clip rounded-[10px] top-[575.4px] w-[340.938px]" data-name="Button">
      <Container29 />
      <Container30 />
    </div>
  );
}

function ImageMinimalistSetup() {
  return (
    <div className="h-[255.703px] relative shrink-0 w-full" data-name="Image (Minimalist Setup)">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageMinimalistSetup} />
    </div>
  );
}

function Container31() {
  return (
    <div className="absolute bg-[#1e2939] content-stretch flex flex-col h-[255.703px] items-start left-0 overflow-clip top-0 w-[340.938px]" data-name="Container">
      <ImageMinimalistSetup />
    </div>
  );
}

function Paragraph16() {
  return (
    <div className="h-[27.995px] relative shrink-0 w-[144.783px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[27.995px] relative w-[144.783px]">
        <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[28px] left-0 not-italic text-[20px] text-nowrap text-white top-[-0.33px] tracking-[-0.4492px] whitespace-pre">Minimalist Setup</p>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="absolute bg-gradient-to-t box-border content-stretch flex from-[rgba(0,0,0,0.8)] h-[255.703px] items-end justify-center left-0 opacity-0 pb-[23.993px] pl-0 pr-[0.009px] pt-0 to-[rgba(0,0,0,0)] top-0 via-50% via-[rgba(0,0,0,0.2)] w-[340.938px]" data-name="Container">
      <Paragraph16 />
    </div>
  );
}

function Button15() {
  return (
    <div className="absolute h-[255.703px] left-[42px] overflow-clip rounded-[10px] top-[863.1px] w-[340.938px]" data-name="Button">
      <Container31 />
      <Container32 />
    </div>
  );
}

function ImageTechHub() {
  return (
    <div className="h-[255.703px] relative shrink-0 w-full" data-name="Image (Tech Hub)">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageTechHub} />
    </div>
  );
}

function Container33() {
  return (
    <div className="absolute bg-[#1e2939] content-stretch flex flex-col h-[255.703px] items-start left-0 overflow-clip top-0 w-[340.938px]" data-name="Container">
      <ImageTechHub />
    </div>
  );
}

function Paragraph17() {
  return (
    <div className="h-[27.995px] relative shrink-0 w-[83.62px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[27.995px] relative w-[83.62px]">
        <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[28px] left-0 not-italic text-[20px] text-nowrap text-white top-[-0.33px] tracking-[-0.4492px] whitespace-pre">Tech Hub</p>
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="absolute bg-gradient-to-t box-border content-stretch flex from-[rgba(0,0,0,0.8)] h-[255.703px] items-end justify-center left-0 opacity-0 pb-[23.993px] pl-0 pr-[0.009px] pt-0 to-[rgba(0,0,0,0)] top-0 via-50% via-[rgba(0,0,0,0.2)] w-[340.938px]" data-name="Container">
      <Paragraph17 />
    </div>
  );
}

function Button16() {
  return (
    <div className="absolute h-[255.703px] left-[414.93px] overflow-clip rounded-[10px] top-[863.1px] w-[340.938px]" data-name="Button">
      <Container33 />
      <Container34 />
    </div>
  );
}

function ImageCafeLifestyle() {
  return (
    <div className="h-[255.703px] relative shrink-0 w-full" data-name="Image (Cafe Lifestyle)">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageCafeLifestyle} />
    </div>
  );
}

function Container35() {
  return (
    <div className="absolute bg-[#1e2939] content-stretch flex flex-col h-[255.703px] items-start left-0 overflow-clip top-0 w-[340.938px]" data-name="Container">
      <ImageCafeLifestyle />
    </div>
  );
}

function Paragraph18() {
  return (
    <div className="h-[27.995px] relative shrink-0 w-[118.594px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[27.995px] relative w-[118.594px]">
        <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[28px] left-0 not-italic text-[20px] text-nowrap text-white top-[-0.33px] tracking-[-0.4492px] whitespace-pre">Cafe Lifestyle</p>
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="absolute bg-gradient-to-t box-border content-stretch flex from-[rgba(0,0,0,0.8)] h-[255.703px] items-end justify-center left-0 opacity-0 pb-[23.993px] pt-0 px-0 to-[rgba(0,0,0,0)] top-0 via-50% via-[rgba(0,0,0,0.2)] w-[340.938px]" data-name="Container">
      <Paragraph18 />
    </div>
  );
}

function Button17() {
  return (
    <div className="absolute h-[255.703px] left-[787.87px] overflow-clip rounded-[10px] top-[863.1px] w-[340.938px]" data-name="Button">
      <Container35 />
      <Container36 />
    </div>
  );
}

function ImageStudyLibrary() {
  return (
    <div className="h-[255.703px] relative shrink-0 w-full" data-name="Image (Study Library)">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageStudyLibrary} />
    </div>
  );
}

function Container37() {
  return (
    <div className="absolute bg-[#1e2939] content-stretch flex flex-col h-[255.703px] items-start left-0 overflow-clip top-0 w-[340.938px]" data-name="Container">
      <ImageStudyLibrary />
    </div>
  );
}

function Paragraph19() {
  return (
    <div className="h-[27.995px] relative shrink-0 w-[116.892px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[27.995px] relative w-[116.892px]">
        <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[28px] left-0 not-italic text-[20px] text-nowrap text-white top-[-0.33px] tracking-[-0.4492px] whitespace-pre">Study Library</p>
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="absolute bg-gradient-to-t box-border content-stretch flex from-[rgba(0,0,0,0.8)] h-[255.703px] items-end justify-center left-0 opacity-0 pb-[23.993px] pt-0 px-0 to-[rgba(0,0,0,0)] top-0 via-50% via-[rgba(0,0,0,0.2)] w-[340.938px]" data-name="Container">
      <Paragraph19 />
    </div>
  );
}

function Button18() {
  return (
    <div className="absolute h-[255.703px] left-[1160.8px] overflow-clip rounded-[10px] top-[863.1px] w-[340.938px]" data-name="Button">
      <Container37 />
      <Container38 />
    </div>
  );
}

function ImageBeachVibes() {
  return (
    <div className="h-[255.703px] relative shrink-0 w-full" data-name="Image (Beach Vibes)">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageBeachVibes} />
    </div>
  );
}

function Container39() {
  return (
    <div className="absolute bg-[#1e2939] content-stretch flex flex-col h-[255.703px] items-start left-0 overflow-clip top-0 w-[340.938px]" data-name="Container">
      <ImageBeachVibes />
    </div>
  );
}

function Paragraph20() {
  return (
    <div className="h-[27.995px] relative shrink-0 w-[108.898px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[27.995px] relative w-[108.898px]">
        <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[28px] left-0 not-italic text-[20px] text-nowrap text-white top-[-0.33px] tracking-[-0.4492px] whitespace-pre">Beach Vibes</p>
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="absolute bg-gradient-to-t box-border content-stretch flex from-[rgba(0,0,0,0.8)] h-[255.703px] items-end justify-center left-0 opacity-0 pb-[23.993px] pl-0 pr-[0.009px] pt-0 to-[rgba(0,0,0,0)] top-0 via-50% via-[rgba(0,0,0,0.2)] w-[340.938px]" data-name="Container">
      <Paragraph20 />
    </div>
  );
}

function Button19() {
  return (
    <div className="absolute h-[255.703px] left-[1533.73px] overflow-clip rounded-[10px] top-[863.1px] w-[340.938px]" data-name="Button">
      <Container39 />
      <Container40 />
    </div>
  );
}

function ImageCoworking() {
  return (
    <div className="h-[255.703px] relative shrink-0 w-full" data-name="Image (Coworking)">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageCoworking} />
    </div>
  );
}

function Container41() {
  return (
    <div className="absolute bg-[#1e2939] content-stretch flex flex-col h-[255.703px] items-start left-0 overflow-clip top-0 w-[340.938px]" data-name="Container">
      <ImageCoworking />
    </div>
  );
}

function Paragraph21() {
  return (
    <div className="h-[27.995px] relative shrink-0 w-[93.733px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[27.995px] relative w-[93.733px]">
        <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[28px] left-0 not-italic text-[20px] text-nowrap text-white top-[-0.33px] tracking-[-0.4492px] whitespace-pre">Coworking</p>
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div className="absolute bg-gradient-to-t box-border content-stretch flex from-[rgba(0,0,0,0.8)] h-[255.703px] items-end justify-center left-0 opacity-0 pb-[23.993px] pt-0 px-0 to-[rgba(0,0,0,0)] top-0 via-50% via-[rgba(0,0,0,0.2)] w-[340.938px]" data-name="Container">
      <Paragraph21 />
    </div>
  );
}

function Button20() {
  return (
    <div className="absolute h-[255.703px] left-[42px] overflow-clip rounded-[10px] top-[1150.8px] w-[340.938px]" data-name="Button">
      <Container41 />
      <Container42 />
    </div>
  );
}

function ImageDesignStudio() {
  return (
    <div className="h-[255.703px] relative shrink-0 w-full" data-name="Image (Design Studio)">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageDesignStudio} />
    </div>
  );
}

function Container43() {
  return (
    <div className="absolute bg-[#1e2939] content-stretch flex flex-col h-[255.703px] items-start left-0 overflow-clip top-0 w-[340.938px]" data-name="Container">
      <ImageDesignStudio />
    </div>
  );
}

function Paragraph22() {
  return (
    <div className="h-[27.995px] relative shrink-0 w-[122.326px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[27.995px] relative w-[122.326px]">
        <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[28px] left-0 not-italic text-[20px] text-nowrap text-white top-[-0.33px] tracking-[-0.4492px] whitespace-pre">Design Studio</p>
      </div>
    </div>
  );
}

function Container44() {
  return (
    <div className="absolute bg-gradient-to-t box-border content-stretch flex from-[rgba(0,0,0,0.8)] h-[255.703px] items-end justify-center left-0 opacity-0 pb-[23.993px] pt-0 px-0 to-[rgba(0,0,0,0)] top-0 via-50% via-[rgba(0,0,0,0.2)] w-[340.938px]" data-name="Container">
      <Paragraph22 />
    </div>
  );
}

function Button21() {
  return (
    <div className="absolute h-[255.703px] left-[414.93px] overflow-clip rounded-[10px] top-[1150.8px] w-[340.938px]" data-name="Button">
      <Container43 />
      <Container44 />
    </div>
  );
}

function ImageHotelRoom() {
  return (
    <div className="h-[255.703px] relative shrink-0 w-full" data-name="Image (Hotel Room)">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageHotelRoom} />
    </div>
  );
}

function Container45() {
  return (
    <div className="absolute bg-[#1e2939] content-stretch flex flex-col h-[255.703px] items-start left-0 overflow-clip top-0 w-[340.938px]" data-name="Container">
      <ImageHotelRoom />
    </div>
  );
}

function Paragraph23() {
  return (
    <div className="h-[27.995px] relative shrink-0 w-[102.448px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[27.995px] relative w-[102.448px]">
        <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[28px] left-0 not-italic text-[20px] text-nowrap text-white top-[-0.33px] tracking-[-0.4492px] whitespace-pre">Hotel Room</p>
      </div>
    </div>
  );
}

function Container46() {
  return (
    <div className="absolute bg-gradient-to-t box-border content-stretch flex from-[rgba(0,0,0,0.8)] h-[255.703px] items-end justify-center left-0 opacity-0 pb-[23.993px] pt-0 px-0 to-[rgba(0,0,0,0)] top-0 via-50% via-[rgba(0,0,0,0.2)] w-[340.938px]" data-name="Container">
      <Paragraph23 />
    </div>
  );
}

function Button22() {
  return (
    <div className="absolute h-[255.703px] left-[787.87px] overflow-clip rounded-[10px] top-[1150.8px] w-[340.938px]" data-name="Button">
      <Container45 />
      <Container46 />
    </div>
  );
}

function Container47() {
  return (
    <div className="h-[1438.5px] relative shrink-0 w-full" data-name="Container">
      <Button />
      <Button1 />
      <Button2 />
      <Button3 />
      <Button4 />
      <Button5 />
      <Button6 />
      <Button7 />
      <Button8 />
      <Button9 />
      <Button10 />
      <Button11 />
      <Button12 />
      <Button13 />
      <Button14 />
      <Button15 />
      <Button16 />
      <Button17 />
      <Button18 />
      <Button19 />
      <Button20 />
      <Button21 />
      <Button22 />
    </div>
  );
}

function DeviceSelection() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[47.995px] h-[1337.78px] items-start left-0 overflow-clip top-0 w-[1916.67px]" data-name="DeviceSelection">
      <Container />
      <Container47 />
    </div>
  );
}

function Paragraph24() {
  return (
    <div className="absolute content-stretch flex h-[24.444px] items-start left-[16px] top-[12px]" data-name="Paragraph">
      <p className="font-['Inter:Regular',_sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[20px] text-nowrap text-white whitespace-pre">Upgrade</p>
    </div>
  );
}

function Container48() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.4)] h-[48px] left-[1769px] rounded-[16px] top-[16px] w-[114px]" data-name="Container">
      <Paragraph24 />
    </div>
  );
}

function Paragraph25() {
  return (
    <div className="absolute content-stretch flex h-[24.444px] items-start left-[736.47px] top-[28px] w-[170.035px]" data-name="Paragraph">
      <p className="font-['Inter:Regular',_sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[20px] text-nowrap text-white whitespace-pre">Choose a mockup</p>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute bottom-1/4 contents left-[37.5%] right-[37.5%] top-1/4" data-name="Group">
      <div className="absolute bottom-1/4 left-[37.5%] opacity-40 right-[37.5%] top-1/4" data-name="Vector">
        <div className="absolute inset-[-8.33%_-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 14">
            <path d={svgPaths.p2ad7cf00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99942" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="h-[23.993px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group />
    </div>
  );
}

function ChevronRight() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[914.5px] size-[23.993px] top-[28px]" data-name="ChevronRight">
      <Icon />
    </div>
  );
}

function Paragraph26() {
  return (
    <div className="absolute content-stretch flex h-[24.444px] items-start left-[946.48px] opacity-40 top-[28px] w-[118.273px]" data-name="Paragraph">
      <p className="font-['Inter:Regular',_sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[20px] text-nowrap text-white whitespace-pre">Upload a file</p>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute bottom-1/4 contents left-[37.5%] right-[37.5%] top-1/4" data-name="Group">
      <div className="absolute bottom-1/4 left-[37.5%] opacity-40 right-[37.5%] top-1/4" data-name="Vector">
        <div className="absolute inset-[-8.33%_-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 14">
            <path d={svgPaths.p2ad7cf00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99942" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="h-[23.993px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group1 />
    </div>
  );
}

function ChevronRight1() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[1072.75px] size-[23.993px] top-[28px]" data-name="ChevronRight">
      <Icon1 />
    </div>
  );
}

function Paragraph27() {
  return (
    <div className="absolute content-stretch flex h-[24.444px] items-start left-[1104.74px] opacity-40 top-[28px] w-[75.46px]" data-name="Paragraph">
      <p className="font-['Inter:Regular',_sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[20px] text-nowrap text-white whitespace-pre">Process</p>
    </div>
  );
}

function Paragraph28() {
  return (
    <div className="absolute content-stretch flex items-start left-[1575px] opacity-40 top-[45px]" data-name="Paragraph">
      <p className="font-['Inter:Regular',_sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">3 free generations left</p>
    </div>
  );
}

function Paragraph29() {
  return (
    <div className="absolute content-stretch flex h-[24.444px] items-start left-[41px] top-[28px] w-[118.411px]" data-name="Paragraph">
      <p className="font-['Inter:Regular',_sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[20px] text-nowrap text-white whitespace-pre">DeviceShots</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute content-stretch flex gap-[10px] h-[4px] items-center left-[1578px] top-[31px] w-[164px]">
      <div className="basis-0 bg-white grow h-full min-h-px min-w-px opacity-60 rounded-[8px] shrink-0" />
      <div className="basis-0 bg-white grow h-full min-h-px min-w-px opacity-60 rounded-[8px] shrink-0" />
      <div className="basis-0 bg-white grow h-full min-h-px min-w-px opacity-60 rounded-[8px] shrink-0" />
    </div>
  );
}

function Container49() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.15)] h-[80px] left-0 top-0 w-[1916px]" data-name="Container">
      <Container48 />
      <Paragraph25 />
      <ChevronRight />
      <Paragraph26 />
      <ChevronRight1 />
      <Paragraph27 />
      <Paragraph28 />
      <Paragraph29 />
      <Frame />
    </div>
  );
}

function App() {
  return (
    <div className="bg-black h-[1401.77px] overflow-clip relative shrink-0 w-full" data-name="App">
      <DeviceSelection />
      <Container49 />
    </div>
  );
}

export default function AnimatedGifCreator() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start relative size-full" data-name="Animated GIF Creator">
      <App />
    </div>
  );
}