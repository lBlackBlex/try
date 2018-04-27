// Copyright 2016, Vasil Nikolov (phpnikolov@gmail.com)

var EMOJI_LIST = [
	{
		title: 'Emoticons',
		premium: false,
		emojis: [
			{className: "mog-emoji-smile", code: " :)", label: "Smiley face"},
			{className: "mog-emoji-frown", code: " :(", label: "Frown"},
			{className: "mog-emoji-tongue", code: " :P", label: "Tongue"},
			{className: "mog-emoji-grin", code: " =D", label: "Big smile"},
			{className: "mog-emoji-gasp", code: " :o", label: "Surprised"},
			{className: "mog-emoji-wink", code: " ;)", label: "Wink"},
			{className: "mog-emoji-glasses", code: " 8-)", label: "glasses"},
			{className: "mog-emoji-sunglasses", code: " B|", label: "Sunglasses"},
			{className: "mog-emoji-grumpy", code: " >:(", label: "Grumpy"},
			{className: "mog-emoji-unsure", code: " :/", label: "Unsure"},
			{className: "mog-emoji-cry", code: " :'(", label: "Crying"},
			{className: "mog-emoji-angel", code: " O:)", label: "Angel"},
			{className: "mog-emoji-kiss", code: " :*", label: "Kiss"},
			{className: "mog-emoji-kiki", code: " ^_^", label: "Kiki"},
			{className: "mog-emoji-squint", code: " -_-", label: "Squint"},
			{className: "mog-emoji-confused", code: " o.O", label: "Confused"},
			{className: "mog-emoji-confused_rev", code: " O.o", label: "Confused"},
			{className: "mog-emoji-colonthree", code: " :3", label: "Curly lips"},
			{className: "mog-emoji-upset", code: " >:o", label: "Upset"},
			{className: "mog-emoji-pacman", code: " :v", label: "Pacman"},
			{className: "mog-emoji-1f604", code: "😄", label: "Big smile"},
			{className: "mog-emoji-1f603", code: "😃", label: "Smiling"},
			{className: "mog-emoji-1f60a", code: "😊", label: "Blushing"},
			{className: "mog-emoji-263a", code: "☺", label: "Blushing"},
			{className: "mog-emoji-1f609", code: "😉", label: "Winking"},
			{className: "mog-emoji-1f60d", code: "😍", label: "In love"},
			{className: "mog-emoji-1f618", code: "😘", label: "Kiss"},
			{className: "mog-emoji-1f61a", code: "😚", label: "Kissing"},
			{className: "mog-emoji-1f61c", code: "😜", label: "Tongue wink"},
			{className: "mog-emoji-1f61d", code: "😝", label: "Tongue out"},
			{className: "mog-emoji-1f633", code: "😳", label: "Shocked"},
			{className: "mog-emoji-1f601", code: "😁", label: "Grinning"},
			{className: "mog-emoji-1f614", code: "😔", label: "Sad face"},
			{className: "mog-emoji-1f60c", code: "😌", label: "Satisfied"},
			{className: "mog-emoji-1f612", code: "😒", label: "Unamused"},
			{className: "mog-emoji-1f61e", code: "😞", label: "Disappointed"},
			{className: "mog-emoji-1f623", code: "😣", label: "Persevering"},
			{className: "mog-emoji-1f622", code: "😢", label: "Crying"},
			{className: "mog-emoji-1f602", code: "😂", label: "Tears of joy"},
			{className: "mog-emoji-1f62d", code: "😭", label: "Loudly crying"},
			{className: "mog-emoji-1f62a", code: "😪", label: "Sleepy"},
			{className: "mog-emoji-1f625", code: "😥", label: "Relieved"},
			{className: "mog-emoji-1f630", code: "😰", label: "Fearful"},
			{className: "mog-emoji-1f613", code: "😓", label: "Cold sweat"},
			{className: "mog-emoji-1f629", code: "😩", label: "Weary"},
			{className: "mog-emoji-1f62b", code: "😫", label: "Tired"},
			{className: "mog-emoji-1f628", code: "😨", label: "Scared"},
			{className: "mog-emoji-1f631", code: "😱", label: "Screaming"},
			{className: "mog-emoji-1f620", code: "😠", label: "Angry"},
			{className: "mog-emoji-1f621", code: "😡", label: "Mad"},
			{className: "mog-emoji-1f624", code: "😤", label: "Big grin"},
			{className: "mog-emoji-1f616", code: "😖", label: "Confounded"},
			{className: "mog-emoji-1f606", code: "😆", label: "Closed eyes"},
			{className: "mog-emoji-1f637", code: "😷", label: "Medic"},
			{className: "mog-emoji-1f635", code: "😵", label: "Dizzy"},
			{className: "mog-emoji-1f632", code: "😲", label: "Astonished"},
			{className: "mog-emoji-1f60f", code: "😏", label: "Smirking"},
			{className: "mog-emoji-1f385", code: "🎅", label: "Santa"},
			{className: "mog-emoji-poop", code: "💩", label: "Poop"},
			{className: "mog-emoji-robot", code: " :|]", label: "Robot"},
			{className: "mog-emoji-1f383", code: "🎃", label: "Jack-o-lantern"},
			{className: "mog-emoji-1f47b", code: "👻", label: "Ghost"},
			{className: "mog-emoji-1f480", code: "💀", label: "Skull"},
			{className: "mog-emoji-1f47f", code: "👿", label: "Imp"},
			{className: "mog-emoji-devil", code: " 3:) ", label: "Devil"},
			{className: "mog-emoji-1f47d", code: "👽", label: "Alien"},
			{className: "mog-emoji-1f47e", code: "👾", label: "Monster"},
			{className: "mog-emoji-putnam", code: " :putnam:", label: "Putnam"},
			{className: "mog-emoji-1f472", code: "👲", label: "Beanie cap"},
			{className: "mog-emoji-1f473", code: "👳", label: "Turban"},
			{className: "mog-emoji-1f46e", code: "👮", label: "Policeman"},
			{className: "mog-emoji-1f477", code: "👷", label: "Hard hat"},
			{className: "mog-emoji-1f482", code: "💂", label: "Guardsman"},
			{className: "mog-emoji-1f476", code: "👶", label: "Baby"},
			{className: "mog-emoji-1f466", code: "👦", label: "Boy"},
			{className: "mog-emoji-1f467", code: "👧", label: "Girl"},
			{className: "mog-emoji-1f468", code: "👨", label: "Man"},
			{className: "mog-emoji-1f469", code: "👩", label: "Woman"},
			{className: "mog-emoji-1f474", code: "👴", label: "Grandpa"},
			{className: "mog-emoji-1f475", code: "👵", label: "Granny"},
			{className: "mog-emoji-1f471", code: "👱", label: "Blonde"},
			{className: "mog-emoji-1f47c", code: "👼", label: "Angel"},
			{className: "mog-emoji-1f478", code: "👸", label: "Princess"},
			{className: "mog-emoji-1f483", code: "💃", label: "Dancer"},
			{className: "mog-emoji-1f46b", code: "👫", label: "Man&woman"},
			{className: "mog-emoji-1f48f", code: "💏", label: "kiss"},
			{className: "mog-emoji-1f491", code: "💑", label: "Love couple"},
			{className: "mog-emoji-1f46f", code: "👯", label: "Bunny ears"},
			{className: "mog-emoji-1f38e", code: "🎎", label: "Boy & girl"},
			/*{ className: "mog-emoji-1f63a", code: "😺", label: "smiling cat face with open mouth" },
			 { className: "mog-emoji-1f638", code: "😸", label: "grinning cat face with smiling eyes" },
			 { className: "mog-emoji-1f63b", code: "😻", label: "smiling cat face with heart-shaped eyes" },
			 { className: "mog-emoji-1f63d", code: "😽", label: "kissing cat face with closed eyes" },
			 { className: "mog-emoji-1f63c", code: "😼", label: "cat face with wry smile" },
			 { className: "mog-emoji-1f640", code: "🙀", label: "weary cat face" },
			 { className: "mog-emoji-1f63f", code: "😿", label: "crying cat face" },
			 { className: "mog-emoji-1f639", code: "😹", label: "cat face with tears of joy" },*/
			//{ className: "mog-emoji-1f4a9", code: "💩", label: "pile of poo" },
			{className: "mog-emoji-1f4a4", code: "💤", label: "Sleeping"},
			{className: "mog-emoji-1f442", code: "👂", label: "Ear"},
			{className: "mog-emoji-1f440", code: "👀", label: "Eyes"},
			{className: "mog-emoji-1f443", code: "👃", label: "Nose"},
			//{ className: "mog-emoji-1f445", code: "👅", label: "tongue" },
			{className: "mog-emoji-1f485", code: "💅", label: "Nail polish"},
			{className: "mog-emoji-1f48b", code: "💋", label: "Kiss mark"},
			{className: "mog-emoji-1f444", code: "👄", label: "Lips"},
			{className: "mog-emoji-1f44d", code: "👍", label: "Like"},
			{className: "mog-emoji-1f44e", code: "👎", label: "Unlike"},
			{className: "mog-emoji-1f44c", code: "👌", label: "OK"},
			{className: "mog-emoji-1f44a", code: "👊", label: "Fist"},
			{className: "mog-emoji-270a", code: "✊", label: "Clenched fist"},
			{className: "mog-emoji-270c", code: "✌", label: "Peace"},
			{className: "mog-emoji-1f64b", code: "🙋", label: "Raising hand"},
			{className: "mog-emoji-1f44b", code: "👋", label: "Waving hand"},
			{className: "mog-emoji-270b", code: "✋", label: "High five"},
			{className: "mog-emoji-1f450", code: "👐", label: "Open hands"},
			{className: "mog-emoji-1f446", code: "👆", label: "Up"},
			{className: "mog-emoji-1f447", code: "👇", label: "Down"},
			{className: "mog-emoji-1f449", code: "👉", label: "Right"},
			{className: "mog-emoji-1f448", code: "👈", label: "Left"},
			{className: "mog-emoji-1f64c", code: "🙌", label: "Raising hands"},
			{className: "mog-emoji-1f64f", code: "🙏", label: "Folded hands"},
			{className: "mog-emoji-261d", code: "☝", label: "Index finger"},
			{className: "mog-emoji-1f44f", code: "👏", label: "Clapping"},
			{className: "mog-emoji-1f4aa", code: "💪", label: "Flexed biceps"},
			//{ className: "mog-emoji-1f64d", code: "🙍", label: "person frowning" },
			//{ className: "mog-emoji-like", code: " (y) ", label: "like!" },
			{className: "mog-emoji-1f48c", code: "💌", label: "Love letter"},
			{className: "mog-emoji-1f49f", code: "💟", label: "White heart"},
			{className: "mog-emoji-1f49b", code: "💛", label: "Yellow heart"},
			{className: "mog-emoji-1f499", code: "💙", label: "Blue heart"},
			{className: "mog-emoji-1f49c", code: "💜", label: "Purple heart"},
			{className: "mog-emoji-1f49a", code: "💚", label: "Green heart"},
			{className: "mog-emoji-2764", code: "❤", label: "Pink heart"},
			{className: "mog-emoji-1f494", code: "💔", label: "Broken heart"},
			{className: "mog-emoji-1f497", code: "💗", label: "Growing heart"},
			{className: "mog-emoji-1f493", code: "💓", label: "Beating heart"},
			{className: "mog-emoji-heart", code: " <3", label: "Heart"},
			{className: "mog-emoji-1f496", code: "💖", label: "Sparkling heart"},
			{className: "mog-emoji-1f49d", code: "💝", label: "heart with ribbon"},
			{className: "mog-emoji-1f49e", code: "💞", label: "Revolving hearts"},
			{className: "mog-emoji-1f498", code: "💘", label: "Heart with arrow"}
		]
	},
	{
		title: 'Objects',
		premium: true,
		emojis: [
			{className: "mog-emoji-2615", code: "☕", label: "Coffee"},
			{className: "mog-emoji-1f375", code: "🍵", label: "Teacup"},
			{className: "mog-emoji-1f376", code: "🍶", label: "Bottle"},
			{className: "mog-emoji-1f37a", code: "🍺", label: "Beer"},
			{className: "mog-emoji-1f37b", code: "🍻", label: "Clinking beer"},
			{className: "mog-emoji-1f378", code: "🍸", label: "Cocktail"},
			{className: "mog-emoji-1f374", code: "🍴", label: "Fork and knife"},
			{className: "mog-emoji-1f354", code: "🍔", label: "Hamburger"},
			{className: "mog-emoji-1f35f", code: "🍟", label: "French fries"},
			{className: "mog-emoji-1f35d", code: "🍝", label: "Spaghetti"},
			{className: "mog-emoji-2668", code: "♨", label: "Hot plate"},
			{className: "mog-emoji-1f35b", code: "🍛", label: "Curry and rice"},
			{className: "mog-emoji-1f371", code: "🍱", label: "Bento box"},
			{className: "mog-emoji-1f363", code: "🍣", label: "Sushi"},
			{className: "mog-emoji-1f359", code: "🍙", label: "Rice ball"},
			{className: "mog-emoji-1f358", code: "🍘", label: "Rice cracker"},
			{className: "mog-emoji-1f35a", code: "🍚", label: "Cooked rice"},
			{className: "mog-emoji-1f35c", code: "🍜", label: "Steaming bowl"},
			{className: "mog-emoji-1f372", code: "🍲", label: "Pot of food"},
			{className: "mog-emoji-1f362", code: "🍢", label: "Oden"},
			{className: "mog-emoji-1f361", code: "🍡", label: "Dango"},
			{className: "mog-emoji-1f373", code: "🍳", label: "Frying pan"},
			{className: "mog-emoji-1f35e", code: "🍞", label: "Bread"},
			{className: "mog-emoji-1f366", code: "🍦", label: "Ice cream"},
			{className: "mog-emoji-1f367", code: "🍧", label: "Shaved ice"},
			{className: "mog-emoji-1f370", code: "🍰", label: "Shortcake"},
			{className: "mog-emoji-1f34e", code: "🍎", label: "Red apple"},
			{className: "mog-emoji-1f34a", code: "🍊", label: "Orange"},
			{className: "mog-emoji-1f349", code: "🍉", label: "Watermelon"},
			{className: "mog-emoji-1f353", code: "🍓", label: "Strawberry"},
			{className: "mog-emoji-1f346", code: "🍆", label: "Aubergine"},
			{className: "mog-emoji-1f345", code: "🍅", label: "Tomato"},
			{className: "mog-emoji-1f3c8", code: "🏈", label: "American football"},
			{className: "mog-emoji-1f3c0", code: "🏀", label: "Basketball"},
			{className: "mog-emoji-26bd", code: "⚽", label: "Soccer"},
			{className: "mog-emoji-26be", code: "⚾", label: "Baseball"},
			{className: "mog-emoji-1f3be", code: "🎾", label: "Tennis"},
			{className: "mog-emoji-1f3b1", code: "🎱", label: "8-ball"},
			{className: "mog-emoji-26f3", code: "⛳", label: "Golf hole"},
			{className: "mog-emoji-1f3bf", code: "🎿", label: "Skis"},
			{className: "mog-emoji-1f004", code: "🀄", label: "Mahjong tile"},
			{className: "mog-emoji-1f3af", code: "🎯", label: "Bullseye"},
			{className: "mog-emoji-1f3c1", code: "🏁", label: "Chequered flag"},
			{className: "mog-emoji-1f3c6", code: "🏆", label: "Trophy"},
			{className: "mog-emoji-1f38c", code: "🎌", label: "Crossed flags"},
			{className: "mog-emoji-1f3a8", code: "🎨", label: "Palette"},
			{className: "mog-emoji-1f3ac", code: "🎬", label: "Clapper board"},
			{className: "mog-emoji-1f3a4", code: "🎤", label: "Microphone"},
			{className: "mog-emoji-1f3a7", code: "🎧", label: "Headphone"},
			{className: "mog-emoji-1f3bc", code: "🎼", label: "Musical score"},
			{className: "mog-emoji-1f3b5", code: "🎵", label: "Musical note"},
			{className: "mog-emoji-1f3b6", code: "🎶", label: "Musical notes"},
			{className: "mog-emoji-1f3ba", code: "🎺", label: "Trumpet"},
			{className: "mog-emoji-1f3b7", code: "🎷", label: "Saxophone"},
			{className: "mog-emoji-1f3b8", code: "🎸", label: "Guitar"},
			{className: "mog-emoji-1f48d", code: "💍", label: "Ring"},
			{className: "mog-emoji-1f48e", code: "💎", label: "Gem stone"},
			{className: "mog-emoji-1f4b0", code: "💰", label: "Money bag"},
			{className: "mog-emoji-1f4b2", code: "💲", label: "Dollar sign"},
			{className: "mog-emoji-1f4b5", code: "💵", label: "Dollar bill"},
			{className: "mog-emoji-1f4b4", code: "💴", label: "Yen bill"},
			{className: "mog-emoji-1f3a9", code: "🎩", label: "Top hat"},
			{className: "mog-emoji-1f451", code: "👑", label: "Crown"},
			{className: "mog-emoji-1f452", code: "👒", label: "Womans hat"},
			{className: "mog-emoji-1f45f", code: "👟", label: "Athletic shoe"},
			{className: "mog-emoji-1f461", code: "👡", label: "Womans sandal"},
			{className: "mog-emoji-1f460", code: "👠", label: "High-heeled shoe"},
			{className: "mog-emoji-1f462", code: "👢", label: "Womans boots"},
			{className: "mog-emoji-1f455", code: "👕", label: "T-shirt"},
			{className: "mog-emoji-1f454", code: "👔", label: "Tie"},
			{className: "mog-emoji-1f457", code: "👗", label: "Dress"},
			{className: "mog-emoji-1f458", code: "👘", label: "Kimono"},
			{className: "mog-emoji-1f459", code: "👙", label: "Bikini"},
			{className: "mog-emoji-1f4bc", code: "💼", label: "Briefcase"},
			{className: "mog-emoji-1f45c", code: "👜", label: "Handbag"},
			{className: "mog-emoji-1f380", code: "🎀", label: "Ribbon"},
			{className: "mog-emoji-2614", code: "☔", label: "Umbrella"},
			{className: "mog-emoji-1f302", code: "🌂", label: "Closed umbrella"},
			{className: "mog-emoji-1f484", code: "💄", label: "Lipstick"},
			{className: "mog-emoji-1f38d", code: "🎍", label: "Pine decoration"},
			{className: "mog-emoji-1f392", code: "🎒", label: "School bag"},
			{className: "mog-emoji-1f38f", code: "🎏", label: "Streamers"},
			{className: "mog-emoji-1f390", code: "🎐", label: "Wind chime"},
			{className: "mog-emoji-1f384", code: "🎄", label: "Christmas tree"},
			{className: "mog-emoji-1f381", code: "🎁", label: "Present"},
			{className: "mog-emoji-1f389", code: "🎉", label: "Party popper"},
			{className: "mog-emoji-1f388", code: "🎈", label: "Balloon"},
			{className: "mog-emoji-1f3a6", code: "🎦", label: "Cinema"},
			{className: "mog-emoji-1f3a5", code: "🎥", label: "Movie camera"},
			{className: "mog-emoji-1f4f7", code: "📷", label: "Camera"},
			{className: "mog-emoji-1f4fc", code: "📼", label: "Bideocassette"},
			{className: "mog-emoji-1f4bf", code: "💿", label: "Optical disc"},
			{className: "mog-emoji-1f4c0", code: "📀", label: "Dvd"},
			{className: "mog-emoji-1f4bd", code: "💽", label: "Minidisc"},
			{className: "mog-emoji-1f4be", code: "💾", label: "Floppy disk"},
			{className: "mog-emoji-1f4bb", code: "💻", label: "Personal computer"},
			{className: "mog-emoji-1f4f1", code: "📱", label: "Mobile phone"},
			{className: "mog-emoji-260e", code: "☎", label: "Telephone"},
			{className: "mog-emoji-1f4de", code: "📞", label: "Phne"},
			{className: "mog-emoji-1f4e0", code: "📠", label: "Fax machine"},
			{className: "mog-emoji-1f4e1", code: "📡", label: "Satellite"},
			{className: "mog-emoji-1f4fa", code: "📺", label: "Television"},
			{className: "mog-emoji-1f4fb", code: "📻", label: "Radio"},
			{className: "mog-emoji-1f508", code: "🔈", label: "Dpeaker"},
			{className: "mog-emoji-1f514", code: "🔔", label: "Bell"},
			{className: "mog-emoji-1f4e2", code: "📢", label: "Loudspeaker"},
			{className: "mog-emoji-1f4e3", code: "📣", label: "Megaphone"},
			{className: "mog-emoji-1f513", code: "🔓", label: "Open lock"},
			{className: "mog-emoji-1f512", code: "🔒", label: "Lock"},
			//{ className: "mog-emoji-1f50f", code: "🔏", label: "Lock with ink pen" },
			{className: "mog-emoji-1f510", code: "🔐", label: "Closed lock with key"},
			{className: "mog-emoji-1f511", code: "🔑", label: "Key"},
			{className: "mog-emoji-1f50e", code: "🔎", label: "Magnifying"},
			{className: "mog-emoji-1f4a1", code: "💡", label: "Light bulb"},
			{className: "mog-emoji-1f6c0", code: "🛀", label: "Bath"},
			{className: "mog-emoji-1f6bd", code: "🚽", label: "Toilet"},
			{className: "mog-emoji-1f528", code: "🔨", label: "Hammer"},
			{className: "mog-emoji-1f6ac", code: "🚬", label: "Cigarette"},
			{className: "mog-emoji-1f4a3", code: "💣", label: "Bomb"},
			{className: "mog-emoji-1f52b", code: "🔫", label: "Pistol"},
			{className: "mog-emoji-1f48a", code: "💊", label: "Pill"},
			{className: "mog-emoji-1f489", code: "💉", label: "Syringe"},
			{className: "mog-emoji-1f4f2", code: "📲", label: "Mobile phone"},
			{className: "mog-emoji-2709", code: "✉", label: "Envelope"},
			{className: "mog-emoji-1f4e9", code: "📩", label: "Sending mail"},
			{className: "mog-emoji-1f4e8", code: "📨", label: "Incoming mail"},
			{className: "mog-emoji-1f4eb", code: "📫", label: "Full mailbox"},
			{className: "mog-emoji-1f4ea", code: "📪", label: "Mailbox"},
			//{ className: "mog-emoji-1f4ec", code: "📬", label: "Full mailbox" },
			//{ className: "mog-emoji-1f4ed", code: "📭", label: "Mailbox" },
			//{ className: "mog-emoji-1f4ee", code: "📮", label: "Postbox" },
			{className: "mog-emoji-1f4dd", code: "📝", label: "Memo"},
			{className: "mog-emoji-2702", code: "✂", label: "Scissors"},
			{className: "mog-emoji-1f4d6", code: "📖", label: "Open book"}
		]
	},
	{
		title: 'Nature',
		premium: true,
		emojis: [
			{className: "mog-emoji-1f436", code: "🐶", label: "Puppy"},
			{className: "mog-emoji-1f43a", code: "🐺", label: "Wolf"},
			{className: "mog-emoji-1f431", code: "🐱", label: "Cat"},
			{className: "mog-emoji-1f42d", code: "🐭", label: "Mouse"},
			{className: "mog-emoji-1f439", code: "🐹", label: "Hamster"},
			{className: "mog-emoji-1f430", code: "🐰", label: "Rabbit"},
			{className: "mog-emoji-1f438", code: "🐸", label: "Frog"},
			{className: "mog-emoji-1f42f", code: "🐯", label: "Tiger"},
			{className: "mog-emoji-1f428", code: "🐨", label: "Koala"},
			{className: "mog-emoji-1f43b", code: "🐻", label: "Teddy"},
			{className: "mog-emoji-1f437", code: "🐷", label: "Piggy"},
			{className: "mog-emoji-1f42e", code: "🐮", label: "Cow"},
			{className: "mog-emoji-1f417", code: "🐗", label: "Boar"},
			{className: "mog-emoji-1f435", code: "🐵", label: "Monkey"},
			{className: "mog-emoji-1f412", code: "🐒", label: "Monkey"},
			{className: "mog-emoji-1f434", code: "🐴", label: "Horse"},
			{className: "mog-emoji-1f411", code: "🐑", label: "Sheep"},
			{className: "mog-emoji-1f418", code: "🐘", label: "Elephant"},
			{className: "mog-emoji-1f427", code: "🐧", label: "Penguin"},
			{className: "mog-emoji-penguin", code: " <(\") ", label: "Penguin"},
			{className: "mog-emoji-1f426", code: "🐦", label: "Blue bird"},
			{className: "mog-emoji-1f425", code: "🐥", label: "Yellow chick"},
			{className: "mog-emoji-1f414", code: "🐔", label: "Chicken"},
			{className: "mog-emoji-1f40d", code: "🐍", label: "Snake"},
			{className: "mog-emoji-1f41b", code: "🐛", label: "Bug"},
			{className: "mog-emoji-1f419", code: "🐙", label: "Octopus"},
			{className: "mog-emoji-1f41a", code: "🐚", label: "Spiral shell"},
			{className: "mog-emoji-1f420", code: "🐠", label: "Tropical fish"},
			{className: "mog-emoji-1f41f", code: "🐟", label: "Fish"},
			{className: "mog-emoji-1f42c", code: "🐬", label: "Dolphin"},
			{className: "mog-emoji-shark", code: " (^^^) ", label: "Shark"},
			{className: "mog-emoji-1f433", code: "🐳", label: "Whale"},
			{className: "mog-emoji-1f40e", code: "🐎", label: "Horse"},
			{className: "mog-emoji-1f421", code: "🐡", label: "Blowfish"},
			{className: "mog-emoji-1f42b", code: "🐫", label: "Camel"},
			{className: "mog-emoji-1f429", code: "🐩", label: "Poodle"},
			{className: "mog-emoji-1f490", code: "💐", label: "Bouquet"},
			{className: "mog-emoji-1f338", code: "🌸", label: "Cherry blossom"},
			{className: "mog-emoji-1f337", code: "🌷", label: "Tulip"},
			{className: "mog-emoji-1f340", code: "🍀", label: "Four leaf clover"},
			{className: "mog-emoji-1f339", code: "🌹", label: "Rose"},
			{className: "mog-emoji-1f33b", code: "🌻", label: "Sunflower"},
			{className: "mog-emoji-1f33a", code: "🌺", label: "Hibiscus"},
			{className: "mog-emoji-1f341", code: "🍁", label: "Maple leaf"},
			{className: "mog-emoji-1f343", code: "🍃", label: "Leaf"},
			{className: "mog-emoji-1f342", code: "🍂", label: "Fallen leaf"},
			{className: "mog-emoji-1f33e", code: "🌾", label: "Ear of rice"},
			{className: "mog-emoji-1f335", code: "🌵", label: "Cactus"},
			{className: "mog-emoji-1f334", code: "🌴", label: "Palm tree"},
			{className: "mog-emoji-1f331", code: "🌱", label: "Seedling"},
			{className: "mog-emoji-1f319", code: "🌙", label: "Moon"},
			{className: "mog-emoji-2b50", code: "⭐", label: "White star"},
			{className: "mog-emoji-26a1", code: "⚡", label: "Lightning"},
			{className: "mog-emoji-2600", code: "☀", label: "Sun"},
			{className: "mog-emoji-1f525", code: "🔥", label: "Fire"},
			{className: "mog-emoji-2728", code: "✨", label: "Stars"},
			{className: "mog-emoji-1f31f", code: "🌟", label: "Glowing star"},
			{className: "mog-emoji-2734", code: "✴", label: "Gray star"},
			{className: "mog-emoji-1f4a8", code: "💨", label: "Wind"},
			{className: "mog-emoji-2601", code: "☁", label: "Cloud"},
			{className: "mog-emoji-1f4a7", code: "💧", label: "Droplet"},
			{className: "mog-emoji-1f4a6", code: "💦", label: "Droplets"},
			{className: "mog-emoji-1f30a", code: "🌊", label: "Wave"},
			{className: "mog-emoji-2733", code: "✳", label: "Snowflake"},
			{className: "mog-emoji-26c4", code: "⛄", label: "Snowman"},
			{className: "mog-emoji-1f300", code: "🌀", label: "Cyclone"},
			{className: "mog-emoji-1f308", code: "🌈", label: "Rainbow"},
			{className: "mog-emoji-1f304", code: "🌄", label: "Sunrise over mountains"},
			{className: "mog-emoji-1f305", code: "🌅", label: "Sunrise"},
			{className: "mog-emoji-1f307", code: "🌇", label: "Sunset"},
			{className: "mog-emoji-1f306", code: "🌆", label: "Dusk"},
			{className: "mog-emoji-1f303", code: "🌃", label: "Starry night"}

		]
	},
	{
		title: 'Places',
		premium: true,
		emojis: [
			{className: "mog-emoji-1f3e0", code: "🏠", label: "House"},
			{className: "mog-emoji-1f3e1", code: "🏡", label: "House with garden"},
			{className: "mog-emoji-1f3eb", code: "🏫", label: "School"},
			{className: "mog-emoji-1f3e2", code: "🏢", label: "Office"},
			{className: "mog-emoji-1f3e3", code: "🏣", label: "Japanese post office"},
			{className: "mog-emoji-1f3e5", code: "🏥", label: "Hospital"},
			{className: "mog-emoji-1f3e6", code: "🏦", label: "Bank"},
			{className: "mog-emoji-1f3ea", code: "🏪", label: "Convenience store"},
			{className: "mog-emoji-1f3e9", code: "🏩", label: "Love hotel"},
			{className: "mog-emoji-1f3e8", code: "🏨", label: "Hotel"},
			{className: "mog-emoji-1f492", code: "💒", label: "Wedding"},
			{className: "mog-emoji-26ea", code: "⛪", label: "Church"},
			{className: "mog-emoji-1f3ec", code: "🏬", label: "Mall"},
			{className: "mog-emoji-1f3ef", code: "🏯", label: "Japanese castle"},
			{className: "mog-emoji-1f3f0", code: "🏰", label: "European castle"},
			{className: "mog-emoji-26fa", code: "⛺", label: "Tent"},
			{className: "mog-emoji-1f3ed", code: "🏭", label: "Factory"},
			{className: "mog-emoji-1f5fc", code: "🗼", label: "Tokyo tower"},
			{className: "mog-emoji-1f5fb", code: "🗻", label: "Mountain"},
			{className: "mog-emoji-1f5fd", code: "🗽", label: "Statue of Liberty"},
			{className: "mog-emoji-1f3a1", code: "🎡", label: "Ferris wheel"},
			{className: "mog-emoji-26f2", code: "⛲", label: "Fountain"},
			{className: "mog-emoji-1f3a2", code: "🎢", label: "Roller coaster"},
			{className: "mog-emoji-1f6a2", code: "🚢", label: "Ship"},
			{className: "mog-emoji-26f5", code: "⛵", label: "Sailboat"},
			{className: "mog-emoji-1f6a4", code: "🚤", label: "Speedboat"},
			{className: "mog-emoji-1f680", code: "🚀", label: "Rocket"},
			{className: "mog-emoji-2708", code: "✈", label: "Airplane"},
			{className: "mog-emoji-1f4ba", code: "💺", label: "Seat"},
			{className: "mog-emoji-1f689", code: "🚉", label: "Station"},
			{className: "mog-emoji-1f684", code: "🚄", label: "Speed train"},
			{className: "mog-emoji-1f685", code: "🚅", label: "Train"},
			{className: "mog-emoji-1f683", code: "🚃", label: "Tram"},
			{className: "mog-emoji-1f68c", code: "🚌", label: "Bus"},
			{className: "mog-emoji-1f699", code: "🚙", label: "Red car"},
			{className: "mog-emoji-1f697", code: "🚗", label: "Blue car"},
			{className: "mog-emoji-1f695", code: "🚕", label: "Taxi"},
			{className: "mog-emoji-1f69a", code: "🚚", label: "Truck"},
			{className: "mog-emoji-1f693", code: "🚓", label: "Police car"},
			{className: "mog-emoji-1f692", code: "🚒", label: "Fire truck"},
			{className: "mog-emoji-1f691", code: "🚑", label: "Ambulance"},
			{className: "mog-emoji-1f6b2", code: "🚲", label: "Bicycle"},
			{className: "mog-emoji-1f488", code: "💈", label: "Barber pole"},
			{className: "mog-emoji-1f68f", code: "🚏", label: "Bus stop"},
			{className: "mog-emoji-1f3ab", code: "🎫", label: "Ticket"},
			{className: "mog-emoji-1f6a5", code: "🚥", label: "Traffic light"},
			{className: "mog-emoji-1f6a7", code: "🚧", label: "Construction"},
			{className: "mog-emoji-26fd", code: "⛽", label: "Fuel pump"},
			{className: "mog-emoji-1f393", code: "🎓", label: "University"},
			{className: "mog-emoji-1f3ad", code: "🎭", label: "Theater"}
		]
	},
	{
		title: 'Symbols',
		premium: true,
		emojis: [
			{className: "mog-emoji-2b06", code: "⬆", label: "Upwards"},
			{className: "mog-emoji-2b07", code: "⬇", label: "Downwards"},
			{className: "mog-emoji-2b05", code: "⬅", label: "Leftwards"},
			{className: "mog-emoji-27a1", code: "➡", label: "Rightwards"},
			{className: "mog-emoji-2197", code: "↗", label: "North east"},
			{className: "mog-emoji-2196", code: "↖", label: "North west"},
			{className: "mog-emoji-2198", code: "↘", label: "South east"},
			{className: "mog-emoji-2199", code: "↙", label: "South west"},
			{className: "mog-emoji-2935", code: "⤵", label: "Down right"},
			{className: "mog-emoji-2934", code: "⤴", label: "Up right"},
			{className: "mog-emoji-1f199", code: "🆙", label: "UP!"},
			{className: "mog-emoji-1f192", code: "🆒", label: "COOL"},
			{className: "mog-emoji-1f4f6", code: "📶", label: "Signal"},
			{className: "mog-emoji-1f201", code: "🈁", label: "\"Here\""},
			{className: "mog-emoji-1f22f", code: "🈯", label: "\"Finger point\""},
			{className: "mog-emoji-1f233", code: "🈳", label: "\"Available\""},
			{className: "mog-emoji-1f235", code: "🈵", label: "\"Full\""},
			{className: "mog-emoji-1f250", code: "🉐", label: "\"bargain\""},
			{className: "mog-emoji-1f239", code: "🈹", label: "\"Sale\""},
			{className: "mog-emoji-1f23a", code: "🈺", label: "\"Work\""},
			{className: "mog-emoji-1f236", code: "🈶", label: "\"To own\""},
			{className: "mog-emoji-1f21a", code: "🈚", label: "\"Nothing\""},
			{className: "mog-emoji-1f6bb", code: "🚻", label: "Couple symbol"},
			{className: "mog-emoji-1f6b9", code: "🚹", label: "Man symbol"},
			{className: "mog-emoji-1f6ba", code: "🚺", label: "Women symbol"},
			{className: "mog-emoji-1f6bc", code: "🚼", label: "Baby symbol"},
			{className: "mog-emoji-1f6be", code: "🚾", label: "WC symbol"},
			{className: "mog-emoji-267f", code: "♿", label: "Wheelchair symbol"},
			{className: "mog-emoji-1f6ad", code: "🚭", label: "No smoking symbol"},
			{className: "mog-emoji-1f237", code: "🈷", label: "\"Month\""},
			{className: "mog-emoji-1f238", code: "🈸", label: "\"Request\""},
			{className: "mog-emoji-1f202", code: "🈂", label: "\"Free\""},
			{className: "mog-emoji-3299", code: "㊙", label: "\"Secret\""},
			{className: "mog-emoji-3297", code: "㊗", label: "\"Congratulation\""},
			{className: "mog-emoji-1f51e", code: "🔞", label: "No under 18 symbol"},
			{className: "mog-emoji-26d4", code: "⛔", label: "No entry"},
			{className: "mog-emoji-274e", code: "❎", label: "Cross mark"},
			{className: "mog-emoji-1f4a2", code: "💢", label: "Anger symbol"},
			{className: "mog-emoji-1f43e", code: "🐾", label: "Footprints"},
			{className: "mog-emoji-1f19a", code: "🆚", label: "VS"},
			{className: "mog-emoji-1f4f3", code: "📳", label: "Vibration mode"},
			{className: "mog-emoji-1f4f4", code: "📴", label: "Mobile phone off"},
			{className: "mog-emoji-1f4a0", code: "💠", label: "Diamond"},
			{className: "mog-emoji-27bf", code: "➿", label: "Curly loops"},
			{className: "mog-emoji-1f3e7", code: "🏧", label: "ATM"},
			{className: "mog-emoji-274c", code: "❌", label: "Cross mark"},
			{className: "mog-emoji-26a0", code: "⚠", label: "Warning sign"},
			{className: "mog-emoji-2757", code: "❗", label: "Exclamation1"},
			{className: "mog-emoji-2753", code: "❓", label: "Exclamation2"},
			{className: "mog-emoji-2755", code: "❕", label: "Exclamation3"},
			{className: "mog-emoji-2754", code: "❔", label: "Question mark"},
			{className: "mog-emoji-2b55", code: "⭕", label: "Red Circle"},
			{className: "mog-emoji-2716", code: "✖", label: "Multiplication"},
			{className: "mog-emoji-2660", code: "♠", label: "Spades"},
			{className: "mog-emoji-2665", code: "♥", label: "Hearts"},
			{className: "mog-emoji-2663", code: "♣", label: "Clubs"},
			{className: "mog-emoji-2666", code: "♦", label: "Diamonds"},
			{className: "mog-emoji-303d", code: "〽", label: "Chart line"},
			{className: "mog-emoji-1f531", code: "🔱", label: "Trident"},
			{className: "mog-emoji-1f530", code: "🔰", label: "Beginner symbol"},
			{className: "mog-emoji-1f532", code: "🔲", label: "Black square"},
			{className: "mog-emoji-1f533", code: "🔳", label: "White square"},
			{className: "mog-emoji-2b1b", code: "⬛", label: "Black large square"},
			{className: "mog-emoji-2b1c", code: "⬜", label: "White large square"},
			{className: "mog-emoji-25fc", code: "◼", label: "Black medium square"},
			{className: "mog-emoji-25fb", code: "◻", label: "White medium square"},
			{className: "mog-emoji-25fe", code: "◾", label: "Black square"},
			{className: "mog-emoji-25fd", code: "◽", label: "White square"},
			{className: "mog-emoji-25aa", code: "▪", label: "Black small square"},
			{className: "mog-emoji-25ab", code: "▫", label: "White small square"},
			{className: "mog-emoji-26ab", code: "⚫", label: "Black circle"},
			{className: "mog-emoji-26aa", code: "⚪", label: "White circle"},
			{className: "mog-emoji-1f534", code: "🔴", label: "Red circle"},
			{className: "mog-emoji-1f535", code: "🔵", label: "Blue circle"},
			{className: "mog-emoji-1f536", code: "🔶", label: "Orange diamond"},
			{className: "mog-emoji-1f537", code: "🔷", label: "Blue diamond"},
			{className: "mog-emoji-1f538", code: "🔸", label: "Small orange diamond"},
			{className: "mog-emoji-1f539", code: "🔹", label: "Small blue diamond"}
		]
	}
];