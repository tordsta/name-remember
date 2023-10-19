import Collapsible from "./Collapsible";

export default function Faq() {
  return (
    <div>
      <h2 className="text-2xl">FAQs</h2>
      <div className="pl-4">
        <Collapsible title={"🔸 Is NameRemember secure?"}>
          <p className="text-lg pl-6 pb-2">
            Absolutely! All uploaded photos and names are securely stored. We
            prioritize your privacy, your data is not shared with anyone.
          </p>
        </Collapsible>
        <Collapsible title={"🔸 Can I use NameRemember with multiple groups?"}>
          <p className="text-lg pl-6 pb-2">
            Yes! NameRemember is designed to handle multiple groups. You can
            switch between groups with ease.
          </p>
        </Collapsible>
      </div>
    </div>
  );
}
